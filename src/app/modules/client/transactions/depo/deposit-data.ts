import { Method } from "src/app/core/models/method.model"
import { TransferMethod } from "src/app/shared/helper"


export const METHODS: Method[] = [
    {
        transferMethod: TransferMethod.CRYPTO,
        icon: "assets/images/icons/usdt.png",
        fee:"0",
        limits: "0",
        proccesingTime: "up to 24 Hours",
        active:true,
        name:TransferMethod.CRYPTO,
        
    },
    {
        transferMethod: TransferMethod.LOCAL_TRANSFER,
        icon: "assets/images/icons/office.png",
        fee:"0",
        limits: "0",
        proccesingTime: "up to 24 Hours",
        active:true,
        name:TransferMethod.LOCAL_TRANSFER,
        
    },
    {
        transferMethod: TransferMethod.WALLET,
        icon: "assets/images/icons/wallet.png",
        fee:"0",
        limits: "0",
        proccesingTime: "up to 24 Hours",
        active:true,
        name:TransferMethod.WALLET,
        
    },
    {
        transferMethod: TransferMethod.MONEY_TRANSFER,
        icon: "assets/images/icons/moneytrans.png",
        fee:"0",
        limits: "0",
        proccesingTime: "up to 24 Hours",
        active:true,
        name:TransferMethod.MONEY_TRANSFER,
        
    }
    ,
    {
        transferMethod: TransferMethod.BANK_TRANSFER,
        icon: "assets/images/icons/bank.png",
        fee:"0",
        limits: "0",
        proccesingTime: "up to 24 Hours",
        active:true,
        name:TransferMethod.BANK_TRANSFER,
        
    }
    ,
    {
        transferMethod: TransferMethod.VISA_CARD,
        icon: "assets/images/icons/visa.png",
        fee:"0",
        limits: "0",
        proccesingTime: "up to 24 Hours",
        active:true,
        name:TransferMethod.VISA_CARD,
        
    }
    ,
    {
        transferMethod: TransferMethod.SKRILL,
        icon: "assets/images/icons/skrill.png",
        fee:"0",
        limits: "0",
        proccesingTime: "up to 24 Hours",
        active:true,
        name:TransferMethod.SKRILL,
        
    }
    ,
    {
        transferMethod: TransferMethod.NETELLER,
        icon: "assets/images/icons/neteller.png",
        fee:"0",
        limits: "0",
        proccesingTime: "up to 24 Hours",
        active:true,
        name:TransferMethod.NETELLER,
        
    }
    ,
    {
        transferMethod: TransferMethod.WISE,
        icon: "assets/images/icons/wize.png",
        fee:"0",
        limits: "0",
        proccesingTime: "Up to 24 Hours",
        active:true,
        name:TransferMethod.WISE,
        
    }
]