import { Component } from "@angular/core";

@Component({
    selector:"loading-modal",
    template:`
    <div class="modal-body bg-transparent">
    <div class="spinner-border text-primary avatar-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
    </div>
    `
})
export class LoadingComponent{

}