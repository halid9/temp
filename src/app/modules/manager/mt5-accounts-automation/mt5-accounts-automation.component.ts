import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";
import { Dialogs } from "src/app/shared/dialogs";
import { environment } from "src/environments/environment";

export type Mt5AccountsAutomationOptions = {
    disableAccountAfterMonthIfNoDeposit: boolean
    monthlyCommisionIfAccountLiveButNoActions: boolean
    commisionAmount: number
    disableAccountAfterSomeMonthesIfNoTradesOrDeals: boolean
    someMonthes: number

}


@Component({
    selector: "mt5-accounts-automation",
    templateUrl: "mt5-accounts-automation.component.html"
})
export class Mt5AccountsAutomationComponent {
    fetching = true
    apiUrl = environment.apiUrl
    saving = false
    options: Mt5AccountsAutomationOptions = {
        disableAccountAfterMonthIfNoDeposit: null,
        monthlyCommisionIfAccountLiveButNoActions: null,
        commisionAmount: 0,
        disableAccountAfterSomeMonthesIfNoTradesOrDeals: null,
        someMonthes:0
    }



    constructor(private http: HttpClient, private translate: TranslateService) {

    }
    async ngOnInit() {


        const options = await firstValueFrom(this.http.get<Mt5AccountsAutomationOptions>(`${this.apiUrl}/mt5manager/automations`))
        this.fetching = false
        this.options = options

    }

    save() {
        this.saving = true
        this.http.post<Mt5AccountsAutomationOptions>(`${this.apiUrl}/mt5manager/automations`, this.options).subscribe(
            {
                next: res => {
                    if (res) Dialogs.success("Options updated!", this.translate)
                        this.saving=false
                },
                error: err => {
                    Dialogs.error(err, this.translate)
                    this.saving=false
                }
            }
        )
    }
}