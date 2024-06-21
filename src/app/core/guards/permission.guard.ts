import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const requiredPermissions = route.data['requiredPermissions'] as string[] 

        if (this.authenticationService.hasPermissions(requiredPermissions)){

       return true
    } 
            // not logged in so redirect to login page with the return url
            this.router.navigate(['access-denied']);
        return false;
    }

}
