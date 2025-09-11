import { asc, count, desc, eq, gt, lt } from 'drizzle-orm'
import { ipcMain } from 'electron'
import * as v from 'valibot'
import { db } from '~/db/config'
import { taxesTable } from '~/db/schema'
import { taxCreateSchema, taxDeleteSchema, taxUpdateSchema } from '~/db/validation'
import { emptyResult } from '~/main/utils/pagination'
import type { CreateTaxInput, PaginatedResult, PaginationType, Tax, UpdateTaxInput } from '~/types'

async function getTaxesCount() {
  return db.select({ count: count() }).from(taxesTable)
}

async function getPreviousTaxesCount(cursor: string) {
  return db.select({ count: count() }).from(taxesTable).where(gt(taxesTable.taxId, cursor))
}

async function getNextTaxesCount(cursor: string) {
  return db.select({ count: count() }).from(taxesTable).where(lt(taxesTable.taxId, cursor))
}

async function getPreviousTaxes(cursor: string | null, itemsPerPage: number) {
  const result = await db.query.taxesTable.findMany({
    where: cursor ? gt(taxesTable.taxId, cursor) : undefined,
    orderBy: [asc(taxesTable.taxId)],
    limit: itemsPerPage,
  })

  return result.reverse()
}

async function getNextTaxes(cursor: string | null, itemsPerPage: number) {
  return db.query.taxesTable.findMany({
    where: cursor ? lt(taxesTable.taxId, cursor) : undefined,
    orderBy: [desc(taxesTable.taxId)],
    limit: itemsPerPage,
  })
}

export async function getTaxes(
  cursor: string | null,
  paginationType: PaginationType | null,
  itemsPerPage: number
): Promise<PaginatedResult<Tax>> {
  const [taxesData, taxesTotal] = await Promise.all([
    paginationType === 'previous'
      ? getPreviousTaxes(cursor, itemsPerPage)
      : getNextTaxes(cursor, itemsPerPage),
    getTaxesCount(),
  ])

  if (!taxesData.length) {
    return emptyResult<Tax>(itemsPerPage)
  }

  const startCursor = taxesData[0].taxId
  const endCursor = taxesData[taxesData.length - 1].taxId

  const [previousTaxesCount, nextTaxesCount] = await Promise.all([
    getPreviousTaxesCount(startCursor),
    getNextTaxesCount(endCursor),
  ])

  return {
    items: taxesData,
    itemsPerPage,
    total: taxesTotal[0].count,
    pageInfo: {
      endCursor,
      hasNextPage: Boolean(nextTaxesCount[0].count),
      hasPreviousPage: Boolean(previousTaxesCount[0].count),
      startCursor,
    },
  }
}

export async function getTax(taxId: string) {
  return db.query.taxesTable.findFirst({ where: eq(taxesTable.taxId, taxId) })
}

export async function createTax(tax: CreateTaxInput) {
  return db.insert(taxesTable).values(tax)
}

export async function updateTax(tax: UpdateTaxInput) {
  return db.update(taxesTable).set(tax).where(eq(taxesTable.taxId, tax.taxId))
}

export async function deleteTax(taxId: string) {
  return db.delete(taxesTable).where(eq(taxesTable.taxId, taxId))
}

export async function registerTaxesIcpHandlers() {
  ipcMain.handle(
    'get-taxes',
    (_, cursor: string | null, paginationType: PaginationType | null, itemsPerPage: number) => {
      return getTaxes(cursor, paginationType, itemsPerPage)
    }
  )

  ipcMain.handle('get-tax', (_, taxId: string) => {
    return getTax(taxId)
  })

  ipcMain.handle('create-tax', (_, tax: CreateTaxInput) => {
    const parsedData = v.safeParse(taxCreateSchema, tax)
    if (!parsedData.success) {
      return {
        errors: v.flatten(parsedData.issues),
      }
    }

    return createTax(parsedData.output)
  })

  ipcMain.handle('update-tax', (_, tax: UpdateTaxInput) => {
    const parsedData = v.safeParse(taxUpdateSchema, tax)
    if (!parsedData.success) {
      return {
        errors: v.flatten(parsedData.issues),
      }
    }

    return updateTax(parsedData.output)
  })

  ipcMain.handle('delete-tax', (_, taxId: string) => {
    const parsedData = v.safeParse(taxDeleteSchema, taxId)
    if (!parsedData.success) {
      return {
        errors: v.flatten(parsedData.issues),
      }
    }

    return deleteTax(parsedData.output)
  })
}
