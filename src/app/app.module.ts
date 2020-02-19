import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../app/material/material.module';
import { SeatAllocationComponent, SessionDialogComponent } from './components/seat-allocation/seat-allocation.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    SeatAllocationComponent,
    SessionDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
