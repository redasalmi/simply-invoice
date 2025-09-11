import { eq } from 'drizzle-orm'
import { ipcMain } from 'electron'
import * as v from 'valibot'
import { db } from '~/db/config'
import { userSettingsTable } from '~/db/schema'
import { userSettingUpdateSchema } from '~/db/validation'
import type { UpdateUserSettingInput } from '~/types'

export async function getUserSettings() {
  return db.query.userSettingsTable.findMany()
}

export async function createDefaultUserSettings() {
  return db
    .insert(userSettingsTable)
    .values([
      {
        settingKey: 'companies-table-items-per-page',
        settingValue: '10',
        settingType: 'number',
      },
      {
        settingKey: 'customers-table-items-per-page',
        settingValue: '10',
        settingType: 'number',
      },
      {
        settingKey: 'services-table-items-per-page',
        settingValue: '10',
        settingType: 'number',
      },
      {
        settingKey: 'taxes-table-items-per-page',
        settingValue: '10',
        settingType: 'number',
      },
      {
        settingKey: 'invoices-table-items-per-page',
        settingValue: '10',
        settingType: 'number',
      },
    ])
    .onConflictDoNothing({
      target: userSettingsTable.settingKey,
    })
}

export async function updateUserSetting(userSetting: UpdateUserSettingInput) {
  return db
    .update(userSettingsTable)
    .set(userSetting)
    .where(eq(userSettingsTable.settingKey, userSetting.settingKey))
}

export async function registerUserSettingsIcpHandlers() {
  ipcMain.handle('get-user-settings', () => {
    return getUserSettings()
  })

  ipcMain.handle('update-user-setting', (_, userSetting: UpdateUserSettingInput) => {
    const parsedData = v.safeParse(userSettingUpdateSchema, userSetting)
    if (!parsedData.success) {
      return {
        errors: v.flatten(parsedData.issues),
      }
    }

    return updateUserSetting(userSetting)
  })
}
