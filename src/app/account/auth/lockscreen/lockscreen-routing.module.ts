import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LockscreenComponent } from "./lockscreen/lockscreen.component";

const routes: Routes = [
  {
    path: "basic",
    component: LockscreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LockScreenRoutingModule { }
