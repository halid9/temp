import { Component, Input } from "@angular/core";
import { User } from "src/app/core/models/auth.models";
import { TransferMethod } from "src/app/shared/helper";

@Component({
    selector:"allowed-gateways",
    templateUrl:"allowed-gateways.component.html",
    styleUrls:["allowed-gateways.component.scss"]
})
export class AllowedGatewaysCompenent{
methods = Object.values(TransferMethod)
transferMethods = []

ngOnInit(){
    this.transferMethods = this.methods.map(m=>{
        return {name:m, enabled:true}
    })
}
}