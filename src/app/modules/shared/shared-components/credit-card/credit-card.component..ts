import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'credit-card',
    templateUrl: "credit-card.component.html"
})
export class CreditCardComponent implements OnInit {
@Output() card:EventEmitter<any> = new EventEmitter<any>()
    cardForm!: UntypedFormGroup;
    

    // Form
    customcardData!: UntypedFormGroup;
    submitted = false;

    constructor(public formBuilder: UntypedFormBuilder) { }
    ngOnInit(): void {
        this.customcardData = this.formBuilder.group({
            card_no: ['', [Validators.required]],
            cardholder: ['', [Validators.required]],
            month: ['', [Validators.required]],
            year: ['', [Validators.required]],
            cvc: ['', [Validators.required]]
        });

        /**
         * Form Validation
         */
        this.cardForm = this.formBuilder.group({
            ids: [''],
            amount: ['', [Validators.required]],
        });
    }

    get form() {
        return this.customcardData.controls;
      }
    
      setcardnumber(e: any) {
        var key = e.keyCode || e.charCode;
        var is_digit = key >= 48 && key <= 57 || key >= 96 && key <= 105;
        var is_delete = key == 8 || key == 46;
        if (is_digit || is_delete) {
          var text = e.target.value;
          (document.getElementById("card-num-elem") as HTMLElement).innerText = text
        }
        if (this.customcardData.valid) {
            console.log(this.customcardData.value)
            
            this.card.emit(this.customcardData.value)

        }
      }
    
      setname(ev: any) {
        (document.getElementById("card-holder-elem") as HTMLElement).innerHTML = ev.target.value
        if (this.customcardData.valid) {
            console.log(this.customcardData.value)
            
            this.card.emit(this.customcardData.value)

        }
      }
    
      setMonth(ev: any) {
        if (!ev.target.value) {
          (document.getElementById("expiry-month-elem") as HTMLElement).innerText = "00";
        } else {
          (document.getElementById("expiry-month-elem") as HTMLElement).innerText = ev.target.value;
        }
        if (this.customcardData.valid) {
            console.log(this.customcardData.value)
            
            this.card.emit(this.customcardData.value)

        }
      }
    
      setYear(ev: any) {
        if (!ev.target.value) {
          (document.getElementById("expiry-year-elem") as HTMLElement).innerText = "00";
        } else {
          (document.getElementById("expiry-year-elem") as HTMLElement).innerText = ev.target.value;
        }
        if (this.customcardData.valid) {
            console.log(this.customcardData.value)
            
            this.card.emit(this.customcardData.value)

        }
      }
    
      setCVC(ev: any) {
        (document.getElementById("cvc-elem") as HTMLElement).innerHTML = ev.target.value
        if (this.customcardData.valid) {
            console.log(this.customcardData.value)
            this.card.emit(this.customcardData.value)

        }
      }
    
      custompay() {
          this.submitted = true;
        if (this.customcardData.valid) {
            console.log(this.customcardData.value)
            
            this.card.emit(this.customcardData.value)

        }

      }

}