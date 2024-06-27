
export enum AccountStatus {
    Pending,
    Active,
    Inactive,
    Deleted,
}
export enum AccountType {
    Demo,
    Live,
    Bonus
}
export enum AccountPlatform {
    MT4,
    MT5,
    Wallet,
}
export interface BreadcrumbItem {
    label: string
    url?: string
    active?: boolean
}