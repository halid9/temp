import { AccountStatus, AccountType, AccountPlatform } from "src/app/shared/interfaces"

export interface AccountModel {
    id: number
    accountName: string
    login: number,
    platform: AccountPlatform | string
    accountType: AccountType
    status: AccountStatus
    balance: number
    leverage: number
    free_margin: number
    equity: number
    margin: number
    margin_level: number
    currency: string
    creationDate?: string
    group: string,
    firstName?: string
    lastName?: string
    note?: string
    agentId?: number
    userId?: number
    accountMasterPassword?: string
    accountInvestorpassword?: string
    masterAccountMT5?: any
    masterAccountMT4?: any
    external?: boolean
    deletedAt?: Date
    enabled?: boolean
}