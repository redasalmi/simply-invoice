import { asc, count, desc, eq, gt, lt } from 'drizzle-orm'
import { ipcMain } from 'electron'
import * as v from 'valibot'
import { db } from '~/db/config'
import { servicesTable } from '~/db/schema'
import { serviceCreateSchema, serviceDeleteSchema, serviceUpdateSchema } from '~/db/validation'
import { emptyResult } from '~/main/utils/pagination'
import type {
  CreateServiceInput,
  PaginatedResult,
  PaginationType,
  Service,
  UpdateServiceInput,
} from '~/types'

async function getServicesCount() {
  return db.select({ count: count() }).from(servicesTable)
}

async function getPreviousServicesCount(cursor: string) {
  return db
    .select({ count: count() })
    .from(servicesTable)
    .where(gt(servicesTable.serviceId, cursor))
}

async function getNextServicesCount(cursor: string) {
  return db
    .select({ count: count() })
    .from(servicesTable)
    .where(lt(servicesTable.serviceId, cursor))
}

async function getPreviousServices(cursor: string | null, itemsPerPage: number) {
  const result = await db.query.servicesTable.findMany({
    where: cursor ? gt(servicesTable.serviceId, cursor) : undefined,
    orderBy: [asc(servicesTable.serviceId)],
    limit: itemsPerPage,
  })

  return result.reverse()
}

async function getNextServices(cursor: string | null, itemsPerPage: number) {
  return db.query.servicesTable.findMany({
    where: cursor ? lt(servicesTable.serviceId, cursor) : undefined,
    orderBy: [desc(servicesTable.serviceId)],
    limit: itemsPerPage,
  })
}

export async function getServices(
  cursor: string | null,
  paginationType: PaginationType | null,
  itemsPerPage: number
): Promise<PaginatedResult<Service>> {
  const [servicesData, servicesTotal] = await Promise.all([
    paginationType === 'previous'
      ? getPreviousServices(cursor, itemsPerPage)
      : getNextServices(cursor, itemsPerPage),
    getServicesCount(),
  ])

  if (!servicesData.length) {
    return emptyResult<Service>(itemsPerPage)
  }

  const startCursor = servicesData[0].serviceId
  const endCursor = servicesData[servicesData.length - 1].serviceId

  const [previousServicesCount, nextServicesCount] = await Promise.all([
    getPreviousServicesCount(startCursor),
    getNextServicesCount(endCursor),
  ])

  return {
    items: servicesData,
    itemsPerPage,
    total: servicesTotal[0].count,
    pageInfo: {
      startCursor,
      endCursor,
      hasNextPage: nextServicesCount[0].count > 0,
      hasPreviousPage: previousServicesCount[0].count > 0,
    },
  }
}

export async function getService(serviceId: string) {
  return db.query.servicesTable.findFirst({
    where: eq(servicesTable.serviceId, serviceId),
  })
}

export async function createService(service: CreateServiceInput) {
  return db.insert(servicesTable).values(service)
}

export async function updateService(service: UpdateServiceInput) {
  return db.update(servicesTable).set(service).where(eq(servicesTable.serviceId, service.serviceId))
}

export async function deleteService(serviceId: string) {
  return db.delete(servicesTable).where(eq(servicesTable.serviceId, serviceId))
}

export async function registerServicesIcpHandlers() {
  ipcMain.handle(
    'get-services',
    (_, cursor: string | null, paginationType: PaginationType | null, itemsPerPage: number) => {
      return getServices(cursor, paginationType, itemsPerPage)
    }
  )

  ipcMain.handle('get-service', (_, serviceId: string) => {
    return getService(serviceId)
  })

  ipcMain.handle('create-service', (_, service: CreateServiceInput) => {
    const parsedData = v.safeParse(serviceCreateSchema, service)
    if (!parsedData.success) {
      return {
        errors: v.flatten(parsedData.issues),
      }
    }

    return createService(parsedData.output)
  })

  ipcMain.handle('update-service', (_, service: UpdateServiceInput) => {
    const parsedData = v.safeParse(serviceUpdateSchema, service)
    if (!parsedData.success) {
      return {
        errors: v.flatten(parsedData.issues),
      }
    }

    return updateService(parsedData.output)
  })

  ipcMain.handle('delete-service', (_, serviceId: string) => {
    const parsedData = v.safeParse(serviceDeleteSchema, serviceId)
    if (!parsedData.success) {
      return {
        errors: v.flatten(parsedData.issues),
      }
    }

    return deleteService(parsedData.output)
  })
}
