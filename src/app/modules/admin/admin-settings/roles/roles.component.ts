import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Role } from "src/app/core/models/role.model";
import { RoleService } from "src/app/core/services/role.service";
import { Dialogs } from "src/app/shared/dialogs";
import { AddRoleComponent } from "./add-role-form/add-role-form.component";
import { EditPermissionsComponent } from "./edit-permissions/edit-permissions.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'roles',
    templateUrl: 'roles.component.html',
    styleUrls: ['roles.component.scss']
})
export class RolesComponent {
    loading = true
    breadCrumbItems!: Array<{}>
    roles: Role[]
    permissions: any[] = []
    constructor(private roleService: RoleService,
         private modal: NgbModal,
         private translate:TranslateService) {

    }
    ngOnInit() {
        this.breadCrumbItems = [
            { label: 'Admin' },
            { label: 'Roles', active: true }
        ];
        this.roleService.roles$.subscribe({
            next: (res: Role[]) => {
                res.length ? this.loading = false : this.loading = true
                this.roles = res

            },
        })
        this.roleService.permissions$.subscribe({
            next: (res: Role[]) => {
                this.permissions = res

            }
        }

        )
        setTimeout(() => {
            this.loading = false
        }, 5000);
    }

    createRole() {
        const modal = this.modal.open(AddRoleComponent, { centered: true, size: 'xl' })
        modal.componentInstance.permissions = this.permissions
        modal.dismissed.subscribe(r => {
            if (r && this.roles.some(role => role.name == r.name)) return Dialogs.error('Role already exist!',this.translate)
            if (r && !this.roles.some(role => role.name == r)) {
                this.roleService.createRole(r).subscribe({
                    next: res => {
                        Dialogs.success('Role created successfully!',this.translate)
                        this.roleService.refresh()
                    },
                    error: err => {
                        Dialogs.error(err,this.translate)
                    }
                })
            }
        })
    }
    refresh() {
        this.loading = true
        this.roleService.refresh()
    }

    edit(currentPermissions: any[], id: any) {
        const modal = this.modal.open(EditPermissionsComponent, { centered: true, size: 'xl' })
        modal.componentInstance.permissions = this.permissions
        modal.componentInstance.selectedPermissions = currentPermissions.slice()
        modal.dismissed.subscribe(result => {
            if (result) {
                const permissions = result.map(p => p.id)
                this.roleService.addPermissionToRole(id, permissions).subscribe({
                    next: res => {
                        if (res) Dialogs.success('Permissions updated successfully!',this.translate)
                        this.refresh()
                    },
                    error: err => {
                        Dialogs.error(err,this.translate)
                    }
                })
            }
        })
    }

    deleteRole(id: any) {
        Dialogs.confirm('Are you sure you want to delete this role?',this.translate, () => {
            this.roleService.deleteRole(id).subscribe({
                next: res => {
                    Dialogs.success('Role deleted successfully!',this.translate)
                    this.refresh()
                },
                error: err => {
                    Dialogs.error(err,this.translate)
                }
            })
        })
    }

}