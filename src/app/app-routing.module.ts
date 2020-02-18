import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeatAllocationComponent } from './components/seat-allocation/seat-allocation.component';


const routes: Routes = [
  { path: '',
  component: SeatAllocationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
