import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RefreshUserGuard implements CanActivate {
    private userPermissions: string[]
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
         this.authenticationService.getCurrentUser()
          return true
    }

}
