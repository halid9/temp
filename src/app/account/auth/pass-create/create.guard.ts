import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { OTPService } from "src/app/core/services/otp.service";

@Injectable({ providedIn: 'root' })
export class CreateGuard implements CanActivate {
    email
    otp
    constructor(private otpServ: OTPService, private router: Router) {

        
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.email = this.otpServ.email
        this.otp = this.otpServ.otp
        if (this.email && this.otp) return true
        this.router.navigate(['auth', 'pass-reset', 'basic'])
        return false
    }
}