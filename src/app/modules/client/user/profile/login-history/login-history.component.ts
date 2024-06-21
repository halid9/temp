import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Observable } from "rxjs";
import { ContentService } from "src/app/core/services/content.service";
import { DataService } from "src/app/core/services/data.service";

@Component({
    selector: 'login-history',
    templateUrl: "login-history.component.html",
    providers: [ContentService]
})
export class LoginHistoryComponent implements OnChanges, OnInit {

    @Input() loginHistory
    loginList$: Observable<any[]>
    total$: Observable<any>
    constructor(private ds: DataService, public contentService: ContentService) {
        this.loginList$ = contentService.contentToVeiw$
        this.total$ = contentService.total$
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['loginHistory']){
        this.contentService.initContent(this.loginHistory)
        }
    }
    ngOnInit() {
        this.contentService.initContent(this.loginHistory)
        this.contentService.pageSize = 8
    }
}