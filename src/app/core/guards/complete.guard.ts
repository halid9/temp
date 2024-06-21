import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class CompleteGuard implements CanActivate {
    private userPermissions: string[]
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const token = localStorage.getItem('token')


        if (token) {
            const user = this.authenticationService._currentUser
            if (user) {
                if (!user?.verificationState?.verified) {
                    const vState = user?.verificationState?.state
                    if (!vState.completeProfile || (!vState.requestLive && !vState.openLive))
                        return true
                }
            }
        }
        this.router.navigate(['dashboard']);
        return false;
    }

}
