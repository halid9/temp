import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { LockScreenRoutingModule } from "./lockscreen-routing.module";
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LockscreenComponent,
  ],
  imports: [
    CommonModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    LockScreenRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class LockscreenModule { }
