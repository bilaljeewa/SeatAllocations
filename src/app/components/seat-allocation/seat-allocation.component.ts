import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { faExclamationTriangle, faCaretUp, faCaretDown, faSyncAlt, faInfo, faFilePdf, faChevronUp, faChevronDown, faTrashAlt, faEllipsisV, faCheckCircle, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';

export interface SessionUnallocated {
  name: string;
}

const ELEMENT_DATA: SessionUnallocated[] = [
  { name: 'Hydrogen' },
  { name: 'Helium' },
  { name: 'Lithium' },
  { name: 'Beryllium' },
  { name: 'Boron' },
  { name: 'Carbon' },
  { name: 'Nitrogen' },
  { name: 'Oxygen' },
  { name: 'Fluorine' },
  { name: 'Neon' },
];

@Component({
  selector: 'app-seat-allocation',
  templateUrl: './seat-allocation.component.html',
  styleUrls: ['./seat-allocation.component.scss']
})
export class SeatAllocationComponent implements OnInit {
  /**FontAwesome Declaration**/
  faExclamationTriangle = faExclamationTriangle;
  faCaretUp = faCaretUp;
  faSyncAlt = faSyncAlt;
  faInfo = faInfo;
  faFilePdf = faFilePdf;
  faChevronUp = faChevronUp;
  faTrashAlt = faTrashAlt;
  faEllipsisV = faEllipsisV;
  faCheckCircle = faCheckCircle;
  faCaretDown = faCaretDown;
  faChevronDown = faChevronDown;

  /**checked table **/
  displayedColumns: string[] = ['select', 'name', 'symbol'];
  dataSource = new MatTableDataSource<SessionUnallocated>(ELEMENT_DATA);
  selection = new SelectionModel<SessionUnallocated>(true, []);

  advancedSessions = [];

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**table fern**/
  fernolumns: string[] = ['image', 'name', 'symbol'];

  constructor(
    public sessionDialog: MatDialog) { }

  ngOnInit() { }

  // open dialog box to add/edit session
  openSessionDialog(session = null, index = null): void {
    let newSession = session;
    const dialogRef = this.sessionDialog.open(SessionDialogComponent, {
      width: '600px',
      data: { session: newSession },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(this.advancedSessions)
      if (result) {
        if (newSession) {

        } else {
          this.advancedSessions.push({
            sessionName: result.sessionName,
            sessionsPrograms: result.sessionsPrograms
          })
        }
      }
    });
  }
}

@Component({
  selector: 'session-dialog.component',
  templateUrl: 'session-dialog.component.html',
  styleUrls: ['./seat-allocation.component.scss']
})
export class SessionDialogComponent {
  faExclamationTriangle = faExclamationTriangle;
  faCaretRight = faCaretRight;

  sessionName: string = '';
  programs: any[] = [
    { id: 1, name: 'Dinner Gala' },
    { id: 2, name: 'Sponsors' },
    { id: 3, name: 'Lunch' },
    { id: 4, name: 'Trip' },
    { id: 5, name: 'Holiday' }
  ];
  errorMessage: Boolean = false;

  programCtrl = new FormControl();
  filteredPrograms: Observable<string[]>;
  sessionPrograms = [];
  sessionData: any;
  @ViewChild('programInput', { static: false }) programInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.session) {
      // this.sessionData = this.data.session;
      this.sessionName = this.data.session.sessionName;
      this.sessionPrograms = this.data.session.sessionsPrograms;
    }

    this.filteredPrograms = this.programCtrl.valueChanges.pipe(
      startWith(null),
      map((program: string | null) => program ? this._filter(program) : this.programs.slice()));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  // remove program
  remove(program: string): void {
    const index = this.sessionPrograms.indexOf(program);
    this.programs.push(program)
    this.programCtrl.setValue(null);
    if (index >= 0) {
      this.sessionPrograms.splice(index, 1);
    }
  }

  // select any program
  selected(event: MatAutocompleteSelectedEvent): void {
    this.sessionPrograms.push(event.option.value);
    this.programs = this.programs.filter(ele => ele.id != event.option.value.id)
    this.programInput.nativeElement.value = '';
    this.programCtrl.setValue(null);
  }

  // async filter the programs
  private _filter(value: any): string[] {
    const filterValue = value.name.toLowerCase();
    return this.programs.filter(program => program.name.toLowerCase().indexOf(filterValue) === 0);
  }

  // save the session
  saveSession() {
    if (!this.sessionName || this.sessionPrograms.length == 0) {
      this.errorMessage = true;
      return;
    }
    this.errorMessage = false;
    this.dialogRef.close({
      sessionName: this.sessionName,
      sessionsPrograms: this.sessionPrograms
    });
  }
}
