import { asc, count, desc, eq, gt, lt } from 'drizzle-orm'
import { ipcMain } from 'electron'
import * as v from 'valibot'
import { db } from '~/db/config'
import { addressesTable, companiesTable } from '~/db/schema'
import {
  addressCreateSchema,
  addressUpdateSchema,
  companyCreateWithAddressSchema,
  companyDeleteSchema,
  companyUpdateWithAddressSchema,
} from '~/db/validation'
import { emptyResult } from '~/main/utils/pagination'
import type {
  AddressCreateFlatErrors,
  AddressUpdateFlatErrors,
  Company,
  CompanyCreateWithAddressFlatErrors,
  CompanyUpdateWithAddressFlatErrors,
  CreateAddressInput,
  CreateCompanyWithAddressInput,
  PaginatedResult,
  PaginationType,
  UpdateAddressInput,
  UpdateCompanyWithAddressInput,
} from '~/types'

async function getCompaniesCount() {
  return db.select({ count: count() }).from(companiesTable)
}

async function getPreviousCompaniesCount(cursor: string) {
  return db
    .select({ count: count() })
    .from(companiesTable)
    .where(gt(companiesTable.companyId, cursor))
}

async function getNextCompaniesCount(cursor: string) {
  return db
    .select({ count: count() })
    .from(companiesTable)
    .where(lt(companiesTable.companyId, cursor))
}

async function getPreviousCompanies(cursor: string | null, itemsPerPage: number) {
  const result = await db.query.companiesTable.findMany({
    where: cursor ? gt(companiesTable.companyId, cursor) : undefined,
    orderBy: [asc(companiesTable.companyId)],
    limit: itemsPerPage,
  })

  return result.reverse()
}

async function getNextCompanies(cursor: string | null, itemsPerPage: number) {
  return db.query.companiesTable.findMany({
    where: cursor ? lt(companiesTable.companyId, cursor) : undefined,
    orderBy: [desc(companiesTable.companyId)],
    limit: itemsPerPage,
  })
}

export async function getCompanies(
  cursor: string | null,
  paginationType: PaginationType | null,
  itemsPerPage: number
): Promise<PaginatedResult<Company>> {
  const [companiesData, companiesTotal] = await Promise.all([
    paginationType === 'previous'
      ? getPreviousCompanies(cursor, itemsPerPage)
      : getNextCompanies(cursor, itemsPerPage),
    getCompaniesCount(),
  ])

  if (!companiesData.length) {
    return emptyResult<Company>(itemsPerPage)
  }

  const startCursor = companiesData[0].companyId
  const endCursor = companiesData[companiesData.length - 1].companyId

  const [previousCompaniesCount, nextCompaniesCount] = await Promise.all([
    getPreviousCompaniesCount(startCursor),
    getNextCompaniesCount(endCursor),
  ])

  return {
    items: companiesData,
    itemsPerPage,
    total: companiesTotal[0].count,
    pageInfo: {
      endCursor,
      hasNextPage: Boolean(nextCompaniesCount[0].count),
      hasPreviousPage: Boolean(previousCompaniesCount[0].count),
      startCursor,
    },
  }
}

export async function getCompany(companyId: string) {
  return db.query.companiesTable.findFirst({
    where: eq(companiesTable.companyId, companyId),
    with: {
      address: true,
    },
  })
}

export async function createCompanyWithAddress(
  company: CreateCompanyWithAddressInput,
  address: CreateAddressInput
) {
  return db.transaction(async (tx) => {
    const [{ addressId }] = await tx
      .insert(addressesTable)
      .values(address)
      .returning({ addressId: addressesTable.addressId })

    if (!addressId) {
      throw new Error('Failed to create address')
    }

    const [{ companyId }] = await tx
      .insert(companiesTable)
      .values({ ...company, addressId })
      .returning({ companyId: companiesTable.companyId })

    return {
      companyId,
      addressId,
    }
  })
}

export async function updateCompanyWithAddress(
  company: UpdateCompanyWithAddressInput,
  address: UpdateAddressInput
) {
  return db.transaction(async (tx) => {
    const [{ addressId }] = await tx
      .update(addressesTable)
      .set(address)
      .where(eq(addressesTable.addressId, address.addressId))
      .returning({ addressId: addressesTable.addressId })

    if (!addressId) {
      throw new Error('Failed to update address')
    }

    const [{ companyId }] = await tx
      .update(companiesTable)
      .set(company)
      .where(eq(companiesTable.companyId, company.companyId))
      .returning({ companyId: companiesTable.companyId })

    return {
      companyId,
      addressId,
    }
  })
}

export async function deleteCompany(companyId: string) {
  return db.delete(companiesTable).where(eq(companiesTable.companyId, companyId))
}

export async function registerCompaniesIcpHandlers() {
  ipcMain.handle(
    'get-companies',
    (_, cursor: string | null, paginationType: PaginationType | null, itemsPerPage: number) => {
      return getCompanies(cursor, paginationType, itemsPerPage)
    }
  )

  ipcMain.handle('get-company', (_, companyId: string) => {
    return getCompany(companyId)
  })

  ipcMain.handle(
    'create-company-with-address',
    (_, company: CreateCompanyWithAddressInput, address: CreateAddressInput) => {
      let companyErrors: CompanyCreateWithAddressFlatErrors | null = null
      let addressErrors: AddressCreateFlatErrors | null = null

      const parsedCompany = v.safeParse(companyCreateWithAddressSchema, company)
      if (!parsedCompany.success) {
        companyErrors = v.flatten(parsedCompany.issues)
      }

      const parsedAddress = v.safeParse(addressCreateSchema, address)
      if (!parsedAddress.success) {
        addressErrors = v.flatten(parsedAddress.issues)
      }

      if (companyErrors || addressErrors) {
        return {
          errors: {
            company: companyErrors,
            address: addressErrors,
          },
        }
      }

      return createCompanyWithAddress(
        parsedCompany.output as CreateCompanyWithAddressInput,
        parsedAddress.output as CreateAddressInput
      )
    }
  )

  ipcMain.handle(
    'update-company-with-address',
    (_, company: UpdateCompanyWithAddressInput, address: UpdateAddressInput) => {
      let companyErrors: CompanyUpdateWithAddressFlatErrors | null = null
      let addressErrors: AddressUpdateFlatErrors | null = null

      const parsedCompany = v.safeParse(companyUpdateWithAddressSchema, company)
      if (!parsedCompany.success) {
        companyErrors = v.flatten(parsedCompany.issues)
      }

      const parsedAddress = v.safeParse(addressUpdateSchema, address)
      if (!parsedAddress.success) {
        addressErrors = v.flatten(parsedAddress.issues)
      }

      if (companyErrors || addressErrors) {
        return {
          errors: {
            company: companyErrors,
            address: addressErrors,
          },
        }
      }

      return updateCompanyWithAddress(
        parsedCompany.output as UpdateCompanyWithAddressInput,
        parsedAddress.output as UpdateAddressInput
      )
    }
  )

  ipcMain.handle('delete-company', (_, companyId: string) => {
    const parsedData = v.safeParse(companyDeleteSchema, companyId)
    if (!parsedData.success) {
      return {
        errors: v.flatten(parsedData.issues),
      }
    }

    return deleteCompany(parsedData.output)
  })
}
