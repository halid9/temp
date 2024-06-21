import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'edit-permissions',
    templateUrl: 'edit-permissions.component.html',
    styleUrls: ['edit-permissions.component.scss']
})

export class EditPermissionsComponent {
    @Input() permissions = []

    @Input() selectedPermissions = []
    validPermissions = []
    constructor(private modal: NgbModal) {

    }

    ngOnInit() {
        this.validPermissions = this.permissions.filter(permission =>
            !this.selectedPermissions.some(selectedPermission => selectedPermission.id === permission.id)
        );
    }

    close() {
        this.modal.dismissAll()
    }
    changeValue(event: any, id: any) {
        
        if (event.target.checked){
            
            this.selectedPermissions.push(this.permissions.find(p=>p.id == id))
        }
        else {
            this.selectedPermissions = this.selectedPermissions.filter(p=> p.id != id)
        }

    }

    isChecked(id: any): boolean {
        return this.selectedPermissions.some(p => p.id == id)
    }
    submit(){
        this.modal.dismissAll(this.selectedPermissions)
    }
}