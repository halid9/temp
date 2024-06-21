import { Component, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable, firstValueFrom } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { LeadsService } from './leads.service';

// Rest Api Service
import { LeadForm } from '../lead-form/lead-form.component';
import { Lead } from 'src/app/core/models/lead.model';
import { ConvertToDemoForm } from './convert-to-demo-form/convert-to-demo-form.component';
import { LeadStatus } from 'src/app/shared/helper';
import { UpdateAgentComponent } from './update-agent/update-agent-form.component';
import { UpdateSupervisorComponent } from './update-supervisor/update-supervisor-form.component';
import { UpdateOwnerComponent } from './update-owner/update-owner-form.component';
import { NgbdCustomSortableHeader, SortEvent } from 'src/app/core/directives/custom-sortable.directive';
import { DataService } from 'src/app/core/services/data.service';
import { ContentService } from 'src/app/core/services/content.service';
import { Dialogs } from 'src/app/shared/dialogs';


import * as XLSX from 'xlsx';
import { HeaderMapComponent } from './header-map/header-map.component';
import { TranslateService } from '@ngx-translate/core';
import { ManageLeadComponent } from './manage-lead/manage-lead.component';
import { EmailSmsFormComponent } from '../../shared/shared-components/email-sms-form/email-sms-form.component';
import { AddNoteComponent } from '../../shared/shared-components/accounts/add-note/add-note.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
  providers: [ContentService, DecimalPipe]
})
/**
 * Leads Component
 */
export class LeadsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  submitted = false;
  // leadsForm!: UntypedFormGroup;
  masterSelected!: boolean;

  // Table data
  loading$: Observable<boolean>
  leadsList!: Observable<Lead[]>;
  total: Observable<number>;
  @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;

  constructor(private modalService: NgbModal,
    public leadService: LeadsService,
    public contentService: ContentService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private translate: TranslateService) {

    this.leadsList = contentService.contentToVeiw$;
    this.total = contentService.total$;
    this.loading$ = contentService.loading$
    contentService.pageSize = 10
  }
  mode: 'normal' | 'campaign' = 'normal'
  campaign
  campaingId

  ngOnInit(): void {
    this.campaign = this.route.snapshot.queryParams['campaignType']
    this.campaingId = this.route.snapshot.fragment
    console.log(this.campaign, this.campaingId)
    this.dataService.refreshLeads()
    this.dataService.leads$.subscribe(leads => {
      if (this.campaign) {
        this.contentService.initContent(leads.filter(l => l.campaign_type == this.campaign && l.campaign_Id == this.campaingId))
      }
      else this.contentService.initContent(leads)
    })
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Leads', active: true }
    ];

    /**
     * Form Validation
     */
    // this.leadsForm = this.formBuilder.group({
    //   image_src: ['avatar-8.jpg'],
    //   ids: [''],
    //   name: ['', [Validators.required]],
    //   company: ['', [Validators.required]],
    //   score: ['', [Validators.required]],
    //   phone: ['', [Validators.required]],
    //   location: ['', [Validators.required]],
    //   tags: ['', [Validators.required]],
    //   date: ['', [Validators.required]]
    // });

  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content?: any, edit?: boolean, view?: boolean) {
    const modal = this.modalService.open(LeadForm, { size: 'lg', centered: true });
    modal.componentInstance.edit = edit
    modal.componentInstance.viewMode = view
    if (content) modal.componentInstance.lead = content
    modal.dismissed.subscribe(res => {
      if (res) {
        Dialogs.success('Lead created', this.translate)
        this.dataService.refreshLeads()
      }
    })
  }

  send(type: string, lead: Lead) {
    if ((type == 'email' && !lead.email) || (type == 'phone' && !lead.phone)) return Dialogs.error(`${type} doesn't exist in lead info`, this.translate)
    const modal = this.modalService.open(EmailSmsFormComponent, { centered: true, size: "lg" })
    modal.componentInstance.type = type
    const destinations = type == 'email' ? lead.email : lead.phone
    modal.componentInstance.destinations = [destinations]

  }

  /**
   * Delete model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    const modal = this.modalService.open(content, { centered: true });
    modal.closed.subscribe(r => {
      if (r == 'yes') {
        this.leadService.deleteLead(id).subscribe({
          next: res => {
            Dialogs.success('Lead deleted', this.translate)
            this.dataService.refreshLeads()

          },
          error: err => {
            Dialogs.error(err, this.translate)

          }
        })
      }
    })
  }









  leadStatuses = LeadStatus
  /**
  * Multiple Default Select2
  */
  selectValue = ['Lead', 'Partner', 'Exiting', 'Long-term'];

  /**
  * Open Edit modal
  * @param content modal content
  */

  //  Filter Offcanvas Set
  // openEnd(content: TemplateRef<any>) {
  //   this.offcanvasService.open(content, { position: 'end' });
  // }

  // Filtering
  loading = false
  leadsSelected = false
  checkForSelected() {
    firstValueFrom(this.leadsList).then(l => this.leadsSelected = l.some(lead => lead.isSelected == true))
  }
  checkUncheckAll(masterSelected: boolean) {
    firstValueFrom(this.leadsList).then(l => l.forEach(lead => lead.isSelected = masterSelected))
    this.leadsSelected = masterSelected
  }
  ManageLead(lead: Lead, edit: boolean = false) {
    const modal = this.modalService.open(ManageLeadComponent, { centered: true, size: 'lg' })
    modal.componentInstance.lead = lead
    modal.componentInstance.editMode = edit
  }
  SearchData() { }
  async convertLeadsToBonus() {
    const leadsIds = (await firstValueFrom(this.leadsList)).filter(l => l.isSelected).map(l => l.id)
    this.leadService.convertToBonus(leadsIds).subscribe({
      next: res => {
        Dialogs.success('leads converted successfully', this.translate)
        this.loading = true
        this.dataService.refreshLeads().then(res => {
          this.loading = false
        })
      },
      error: err => {
        Dialogs.error(err, this.translate)
      }
    }
    )

  }
  secondarydecrement(num: number) {
    this.contentService.pageSize -= num
  }
  secondaryincrement(num: number) {
    this.contentService.pageSize += num

  }

  convertToBonus(id) {
    Dialogs.confirm(this.leadService.convertToBonus([id]), this.translate, () => {
      this.loading = true
      this.dataService.refreshLeads().then(res => {
        this.loading = false
      })

    })
  }

  rejectBonus(id: number) {
    Dialogs.confirm('Are you sure you want to reject this lead to bonus?', this.translate, () => {
      const modal = this.modalService.open(AddNoteComponent, { centered: true })
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
          this.dataService.refreshLeads()
        }, 500);
      })

    })

  }

  undoBonus(id: number) {
    this.leadService.rejectBonus([id]).subscribe({
      next: res => {
        Dialogs.success('lead converted successfully', this.translate)
      },
      error: err => {
        Dialogs.error(err, this.translate)
      }
    }
    )
  }

  convertToDemo(lead: Lead) {
    const modal = this.modalService.open(ConvertToDemoForm, { centered: true })
    modal.componentInstance.id = lead.id
    modal.componentInstance.lead = lead
    modal.componentInstance.convertTo = 'demo'
  }
  convertToLive(lead: Lead) {
    const modal = this.modalService.open(ConvertToDemoForm, { centered: true })
    modal.componentInstance.id = lead.id
    modal.componentInstance.lead = lead
    modal.componentInstance.convertTo = 'live'
  }
  updateAgentModal(lead: Lead) {
    const modal = this.modalService.open(UpdateAgentComponent, { centered: true })
    modal.componentInstance.leadId = lead.id
    modal.componentInstance.agent = lead.agentId ?? 0
    modal.componentInstance.agents = this.leadService.agents.slice()
  }
  updateSupervisorModal(lead: Lead) {
    const modal = this.modalService.open(UpdateSupervisorComponent, { centered: true })
    modal.componentInstance.leadId = lead.id
    modal.componentInstance.supervisor = lead.supervisorId ?? 0
    modal.componentInstance.supervisors = this.leadService.supervisors.slice()
  }
  updateOwnerModal(lead: Lead) {
    const modal = this.modalService.open(UpdateOwnerComponent, { centered: true })
    modal.componentInstance.leadId = lead.id
    modal.componentInstance.owner = lead.leadOwner ?? 0
    modal.componentInstance.owners = this.leadService.owners.slice()
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.contentService.sortColumn = column;
    this.contentService.sortDirection = direction;
  }

  tradingExperience(v) {

    v = parseInt(v)

    return [
      'NOEXPERIENCE',
      'LESSTHANYEAR',
      "ONEYEAR",
      "TWOYEARS",
      "THREEYEARS",
      "FOURYEARS",
      "MORETHANFOURYEARS"
    ][v];

  }

  setType(id: any) {
    this.contentService.filter = id
  }




  ///////// importing leads from excel file /////////
  importedData = []
  import() {
    const inputElement = document.createElement('input') as HTMLInputElement;
    inputElement.type = 'file';
    inputElement.style.display = 'none';
    inputElement.addEventListener('change', (event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const selectedFile = input.files[0];
        // Handle the selected file here
        this.handleFileChanged(selectedFile)
      }

      // Clean up the input element
    });

    inputElement.click();
  }

  handleFileChanged(selectedFile) {
    const file = selectedFile;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;
      this.processExcel(data);
    };
    reader.readAsBinaryString(file);
  }
  processExcel(data: any) {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const headers: string[] = [];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: range.s.r }; // Assuming headers are in the first row
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      const cellValue = worksheet[cell_ref]?.v;
      headers.push(cellValue || ''); // Use empty string if cellValue is undefined
    }

    const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
    this.importedData = excelData.slice()
    this.mapHeader(headers)
    // const mappedData = excelData.map(l => {
    //   const lead: Partial<Lead> = { firstName: l['firstName'], lastName: l['lastName'],phone:l['phone'],email:l['email']}
    //   return lead
    // })
    // console.log(mappedData)


    // this.accounts = [...this.accounts, ...mappedData]
    // this.contentService.initContent(this.accounts)
  }
  mapHeader(existingKeys: string[]) {
    const modal = this.modalService.open(HeaderMapComponent, { centered: true })
    modal.componentInstance.headers = existingKeys
    modal.closed.subscribe(async res => {
      if (res) {

        const data = this.importedData.map(l => {

          const lead: Lead = {
            firstName: l[res.firstName ?? 'firstName'],
            lastName: l[res.lastName ?? 'lastName'],
            phone: l[res.phone ?? 'phone'],
            email: l[res.email ?? 'email'],
            accountType: l[res.accountType ?? 'accountType'],
            address: l[res.address ?? 'address'],
            anotherCompanyAccount: l[res.anotherCompanyAccount ?? 'anotherCompanyAccount'],
            anotherCompanyDetails: l[res.anotherCompanyDetails ?? 'anotherCompanyDetails'],
            blackList: l[res.blackList ?? 'blackList'],
            reason: l[res.reason ?? 'reason'],
            customerInterestScale: l[res.customerInterestScale ?? 'customerInterestScale'],
            leadSource: l[res.leadSource ?? 'leadSource'],
            leadStatus: l[res.leadStatus ?? 'leadStatus'],
            notes: l[res.notes ?? 'notes'],
            natunality: l[res.natunality ?? 'natunality'],
            work: l[res.work ?? 'work'],

          }
          return lead
        })

        this.importedData = data
        await firstValueFrom(this.leadService.import(data)).then(
          res => {
            if (res) this.dataService.refreshLeads()
          }
        )
      }

    })
  }

  //////// export exil ////////

  async export() {
    const leads = await firstValueFrom(this.leadsList)
    const selectedLeads = leads.filter(l => l.isSelected == true)
    const header = Object.keys(selectedLeads[0]);
    const values = selectedLeads.map((obj) => Object.values(obj));

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([header, ...values]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'exported-data.xlsx');
  }
}
