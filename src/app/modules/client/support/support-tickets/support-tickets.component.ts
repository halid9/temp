import { Component, QueryList, TemplateRef, ViewChildren } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { CreateTicketDTO, SupportTicketModel } from "./support-ticket.model";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { restApiService } from "src/app/core/services/rest-api.service";
import { DatePipe, DecimalPipe } from "@angular/common";
import { NgbdTicketsSortableHeader } from "./tickets-sortable.directive";
import Swal from "sweetalert2";
import { TicketsService } from "./support-tickets.service";
import { TicketForm } from "./ticket-form/ticket-form.component";
import { UserTypes } from "src/app/shared/helper";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ClientTicketFormComponent } from "./client-ticket-form/client-ticket-form.component";
import { NotificationsService } from "src/app/core/services/notifications.service";

@Component({
  selector: "app-support-tickets",
  templateUrl: "support-tickets.component.html",
  styleUrls: ["support-tickets.component.scss"],
  providers: [TicketsService, DecimalPipe,DatePipe]
})
export class SupportTicketsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  ticketsForm!: UntypedFormGroup;
  TicketsData!: SupportTicketModel[];
  masterSelected!: boolean;
  checkedList: any;
  selectedTicket: any;

  // Api Data
  content?: any;
  tickets?: any;
  econtent?: any;

  // Table data
  ticketsList!: Observable<SupportTicketModel[]>;
  total: Observable<number>;
  @ViewChildren(NgbdTicketsSortableHeader)
  headers!: QueryList<NgbdTicketsSortableHeader>;
  ticketStatuses: any = ['Open', 'Closed']
  reply: any = ''
  constructor(
    private modalService: NgbModal,
    public service: TicketsService,
    private formBuilder: UntypedFormBuilder,
    private ApiService: restApiService,
    private offcanvasService: NgbOffcanvas,
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    private notifications:NotificationsService
  ) {
    this.ticketsList = service.tickets$;
    this.total = service.total$;
    console.log('tickets:100');

  }

  async ngOnInit() {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [{ label: "Tickets", active: true }];

    // this.tickets = this.service.tickets;
    this.getTicketsData();
    console.log('tickets: ', this.tickets);
    /**
     * Form Validation
     */
    this.ticketsForm = this.formBuilder.group({
      image_src: ["avatar-8.jpg"],
      ids: [""],
      name: ["", [Validators.required]],
      company: ["", [Validators.required]],
      score: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      location: ["", [Validators.required]],
      tags: ["", [Validators.required]],
      date: ["", [Validators.required]],
    });

    /**
     * fetches data
     */
    setTimeout(() => {
      this.ticketsList.subscribe((x) => {
        this.content = this.tickets;
        this.tickets = Object.assign([], x);
      });
      document.getElementById("elmLoader")?.classList.add("d-none");
    }, 1000);
  }
  async getTicketsData() {
    return this.service.getTicketData().subscribe(data => {
      this.tickets = data;
      console.log('ngoninit tickets', this.tickets);
    })
  }

  openViewItemModal(content: any, id: any): void {
    const ticket = this.tickets.find((t: { id: any; }) => t.id === id);
    if (ticket) {
      this.selectedTicket = ticket;
      this.modalService.open(content, { centered: true });
      this.scrollToBottom();

    }
  }

  parseConversationHistory(conversationHistory: string): any[] {
    try {
      if (conversationHistory === null || conversationHistory.trim() === "") {
        return [];
      }
      return JSON.parse(conversationHistory);
    } catch (error) {
      console.log('Error parsing conversation history:', error);
      return [];
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
  }

  selectedTicketStatus: string = 'Open';

  openStatusUpdateModal(content: any, id: any) {
    const ticket = this.tickets.find((t: { id: any; }) => t.id === id);
    if (ticket) {
      this.selectedTicket = ticket;
      this.selectedTicketStatus = ticket.status;
      this.modalService.open(content, { centered: true });

    }
  }

  isAdmin() {
    return this.authService._currentUser.type === UserTypes.Admin
  }

  submitReply(reply) {
    if (!reply || reply.trim() === '') return;
    if (!this.selectedTicket.conversationHistory) this.selectedTicket.conversationHistory = [];
    let username = this.isAdmin() ? 'mastertech' : this.authService._currentUser.username
    const model = {
      "message": reply,
      "ts": new Date(),
      "username": username
    };
    this.ApiService.ticketReply(this.selectedTicket.id, model).subscribe({
      next: (response) => {
        const parsedHistory = this.parseConversationHistory(this.selectedTicket.conversationHistory);
        parsedHistory.push(model);
        this.selectedTicket.conversationHistory = JSON.stringify(parsedHistory);
        this.reply = '';
        this.scrollToBottom();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to send a reply. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-container');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }
  updateTicketStatus() {
    this.selectedTicket.status = this.selectedTicketStatus;
    this.ApiService.patchTicketData(this.selectedTicket)
      .subscribe({
        next: (updatedTicket) => {
          Swal.fire({
            icon: 'success',
            title: 'Ticket Status Updated',
            text: `The status of the ticket has been updated to ${updatedTicket.status}.`,
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          // Handle error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update the ticket status. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      });
  }



  openModal(content: any) {
    this.submitted = false;
    const modalRef = this.modalService.open(TicketForm, { size: "lg", centered: true });

    // Subscribe to the component instance's onSubmit event
    modalRef.componentInstance.ticketSubmitted.subscribe((ticket: CreateTicketDTO) => {
      this
      console.log('submitted ticket:', ticket); // Access the submitted ticket value here
      // Do whatever you want with the submitted ticket value
      this.saveTicket(ticket);
      this.submitted = true;
      this.notifications.notifyAdmin({title:"support ticket",message:"user submitted support ticket"})

      // ...
    });
  }

  openClientNewTicketModal() {
    const modalRef = this.modalService.open(ClientTicketFormComponent, { size: "lg", centered: true });

    modalRef.componentInstance.ticketSubmitted.subscribe((ticket: CreateTicketDTO) => {
      console.log('submitted ticket:', ticket);
      this.saveTicket(ticket);
      this.submitted = true;
    });
  }

  /**
   * Form data get
   */
  get form() {
    return this.ticketsForm.controls;
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    document.getElementById("");
    this.ticketsForm.patchValue({
      // image_src: file.name
      image_src: "avatar-8.jpg",
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      (document.getElementById("ticket-img") as HTMLImageElement).src =
        this.imageURL;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Save ticket
   */
  saveTicket(ticket: CreateTicketDTO) {
    this.ApiService.postTicketData(ticket).subscribe(
      async (data: any) => {
        this.service.tickets.push(data.data);
        this.modalService.dismissAll();
        let timerInterval: any;
        Swal.fire({
          title: 'Ticket inserted successfully!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            clearInterval(timerInterval);
            // Add any additional logic you want to execute after the Swal notification closes
          }
        });
        await this.getTicketsData();

        setTimeout(() => {
          this.ticketsForm.reset();
        }, 2000);
        this.submitted = true;
      },
      (error: any) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to insert the ticket',
          icon: 'error'
        });
      }
    );
  }
  // saveTicket(ticket:CreateTicketDTO) {
  //       this.ApiService.postTicketData(ticket).subscribe(
  //         (data: any) => {
  //           this.service.tickets.push(data.data);
  //           this.modalService.dismissAll();
  //           let timerInterval: any;
  //           Swal.fire({
  //             title: "Ticket inserted successfully!",
  //             icon: "success",
  //             timer: 2000,
  //             timerProgressBar: true,
  //             willClose: () => {
  //               clearInterval(timerInterval);
  //             },
  //           }).then((result) => {
  //             if (result.dismiss === Swal.DismissReason.timer) {
  //             }
  //           });
  //         }
  //       );
  //       setTimeout(() => {
  //         this.ticketsForm.reset();
  //       }, 2000);
  //       this.submitted = true;
  //   }


  /**
   * Delete model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  // Delete Data
  deleteData(id: any) {
    if (id) {
      this.ApiService.deleteTicket(id).subscribe({
        next: () => {
          window.location.reload();
          Swal.fire('Deleted', 'The ticket has been deleted successfully', 'success');
        },
        error: (err) => {
          this.content = JSON.parse(err.error).message;
          Swal.fire('Error', 'Failed to delete the ticket', 'error');
        }
      });
    }
  }



  //  Filter Offcanvas Set
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: "end" });
  }

  // Filtering
  isstatus?: any;
  SearchData() {
    var date = document.getElementById("isDate") as HTMLInputElement;
    var dateVal = date.value
      ? this.datePipe.transform(new Date(date.value), "yyyy-MM-dd")
      : "";

    if (dateVal != "") {
      this.tickets = this.content.filter((order: any) => {
        return (
          this.datePipe.transform(new Date(order.date), "yyyy-MM-dd") == dateVal
        );
      });
    } else {
      this.tickets = this.content;
    }
  }
}
