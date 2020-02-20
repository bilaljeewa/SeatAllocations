import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from '../app/material/material.module';
import { SeatAllocationComponent, SessionDialogComponent } from './components/seat-allocation/seat-allocation.component';

@NgModule({
  declarations: [
    AppComponent,
    SeatAllocationComponent,
    SessionDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SessionDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }