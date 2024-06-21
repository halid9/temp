import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Lead } from "src/app/core/models/lead.model";
import { LeadsService } from "../leads.service";
import { Dialogs } from "src/app/shared/dialogs";
import { TranslateService } from "@ngx-translate/core";
import { FileManagerService } from "src/app/core/services/file-manager.service";
import { HttpResponse } from "@angular/common/http";
import { ConvertToDemoForm } from "../convert-to-demo-form/convert-to-demo-form.component";
import { AddNoteComponent } from "src/app/modules/shared/shared-components/accounts/add-note/add-note.component";
import { DataService } from "src/app/core/services/data.service";
@Component({
    selector: "manage-lead",
    templateUrl: "manage-lead.component.html",
    styleUrls:['manage-lead.component.scss']
})
export class ManageLeadComponent {
    @Input() editMode = false
    @Input() lead: Lead

    @Input() docSrc: any
    @Input() docType: 'image' | 'pdf' = 'image'
    isLoadingFile = false;

    constructor(private activeModel: NgbActiveModal,
        private leadService: LeadsService,
        private ds:DataService,
        private fileService: FileManagerService,
        private modal:NgbModal,
        private translate: TranslateService) { }

    ngOnInit() {
        this.viewDocument();
    }
    close() {
        this.activeModel.dismiss()
    }
    convertToBonus(id) {
        Dialogs.confirm(this.leadService.convertToBonus([id]), this.translate, () => {
          
            this.ds.refreshLeads()
    
        })
      }
    
      rejectBonus(id: number) {
        Dialogs.confirm('Are you sure you want to reject this lead to bonus?', this.translate, () => {
          const modal = this.modal.open(AddNoteComponent, { centered: true })
          modal.closed.subscribe(res => {
    
            this.leadService.rejectBonus([id]).subscribe({
              next: res => {
                Dialogs.success('lead rejected successfully', this.translate)
              },
              error: err => {
                Dialogs.error(err, this.translate)
              }
            }
            )
            setTimeout(() => {
              this.ds.refreshLeads()
            }, 500);
          })
    
        })
    
      }
      
    viewDocument() {
        this.docSrc = null
        this.docType = null
        if (!this.lead.idPhotoId) return;
        this.isLoadingFile = true;
        this.fileService.getFile(this.lead.idPhotoId).subscribe(
            {
                next: (res: HttpResponse<Blob>) => {
                    const contentTypeHeader = res.headers.get('Content-Type');
                    const doc = URL.createObjectURL(res.body)

                    this.docSrc = doc

                    if (contentTypeHeader.includes('image')) this.docType = 'image'
                    else this.docType = 'pdf'

                    this.isLoadingFile = false;

                },
                error: err => {
                    this.isLoadingFile = false;
                    Dialogs.error(err, this.translate)
                }
            }
        )

    }
     convertToUser(lead: Lead) {
    const modal = this.modal.open(ConvertToDemoForm, { centered: true })
    modal.componentInstance.id = lead.id
    modal.componentInstance.lead = lead
    modal.componentInstance.convertTo = 'demo'
  }



  // image or pdf control
  zoom = 1
  zoomIn() {
    if (this.docType == "image") {

      const pic = document.getElementById("pic");
      const width = pic.clientWidth;
      pic.style.width = (width + 100) + "px";
      // const height = pic.clientHeight;
      // pic.style.height = (height + 100) + "px";
      pic.style.maxHeight = 'none'
      pic.style.maxWidth = 'none'
    }
    else this.zoom++
  }

  zoomOut() {
    if (this.docType == "image") {

      const pic = document.getElementById("pic");
      const width = pic.clientWidth;
      pic.style.width = (width - 100) + "px";
      // const height = pic.clientHeight;
      // pic.style.height = (height - 100) + "px";
      pic.style.maxHeight = 'none'
      pic.style.maxWidth = 'none'
    }
    else this.zoom--
  }
  rotationAngle = 0;

  rotateImage(degrees: number) {
    this.rotationAngle += degrees;
  }
}