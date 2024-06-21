import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { OTPService } from "src/app/core/services/otp.service";

@Injectable({ providedIn: 'root' })
export class OtpGuard implements CanActivate {
    email
    constructor(private otp: OTPService, private router: Router) {
        this.email = this.otp.email
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (this.email) return true
        this.router.navigate(['auth', 'login'])
        return false
    }
}
@Injectable({ providedIn: 'root' })
export class PhoneVerifyGuard implements CanActivate {
    constructor(private router: Router) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const vState = JSON.parse(localStorage.getItem('verificationState'))
        if (!vState.deviceVerified || !vState.phoneVerified ) return true
        this.router.navigate(['access-denied'])
        return false
    }
}

@Injectable({ providedIn: 'root' })
export class EmailVerifyGuard implements CanActivate {
    constructor(private router: Router) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const vState = JSON.parse(localStorage.getItem('verificationState'))
        if (!vState.deviceVerified || !vState.emailVerified ) return true
        this.router.navigate(['access-denied'])
        return false
    }
}

@Injectable({ providedIn: 'root' })
export class DeviceVerifyGuard implements CanActivate {
    constructor(private router: Router) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const vState = JSON.parse(localStorage.getItem('verificationState'))
        if (!vState.deviceVerified) return true
        this.router.navigate(['access-denied'])
        return false
    }
}