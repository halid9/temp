import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Observable } from "rxjs";
import { ContentService } from "src/app/core/services/content.service";
import { DataService } from "src/app/core/services/data.service";

@Component({
    selector: 'activity-logs',
    templateUrl: "activity-logs.component.html",
    providers: [ContentService]
})
export class ActivityLogsComponent implements OnChanges, OnInit {

    @Input() activityLogs
    activityList$: Observable<any[]>
    total$: Observable<any>
    constructor(private ds: DataService, public contentService: ContentService) {
        this.activityList$ = contentService.contentToVeiw$
        this.total$ = contentService.total$
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['activityLogs']){
        this.contentService.initContent(this.activityLogs)
        }
    }
    ngOnInit() {
        this.contentService.initContent(this.activityLogs)
        this.contentService.pageSize = 8
    }
}