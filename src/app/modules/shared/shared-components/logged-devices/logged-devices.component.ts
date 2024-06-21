import { Component, Input, SimpleChanges } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Dialogs } from "src/app/shared/dialogs";
import { LoginHistory, ProfileService } from "../../../../core/services/profile.service";
import { Observable, firstValueFrom } from "rxjs";
import { Response } from 'src/app/shared/helper';
import { ContentService } from "src/app/core/services/content.service";
import { TranslateService } from "@ngx-translate/core";
import { User } from "src/app/core/models/auth.models";


@Component({
    selector: 'logged-devices',
    templateUrl: "logged-devices.component.html",
    providers: [ContentService]
})
export class LoggedDevicesComponent {
    @Input() forUser = false
    @Input() user:User
    @Input() loggedInDevices: LoginHistory[] = []
    devices$: Observable<any>
    total$: Observable<any>
    constructor(private auth: AuthenticationService,
        private profileService: ProfileService,
        public contentService: ContentService,
        private translate:TranslateService) {

        this.devices$ = contentService.contentToVeiw$
        this.total$ = contentService.total$
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes['loggedInDevices']) {
            this.contentService.initContent(this.loggedInDevices)

        }
    }
    ngOnInit() {
        this.contentService.initContent(this.loggedInDevices)
        this.contentService.pageSize = 6
    }
    async refresh() {
        this.loggedInDevices = await firstValueFrom(this.profileService.getLoginHistoryByDevice())
        this.contentService.initContent(this.loggedInDevices)

        this.profileService.loggedInDevices = this.loggedInDevices
    }
    logout(id: any) {
        this.auth.logoutDevice(id).subscribe({
            next: async (res: Response<any>) => {
                Dialogs.success(res.message,this.translate)
                this.loggedInDevices = await firstValueFrom(this.profileService.getLoginHistoryByDevice())
            },
            error: err => {
                Dialogs.error(err,this.translate)
            }
        })
    }
    allLogout() {
        this.auth.logoutAll()
    }
}