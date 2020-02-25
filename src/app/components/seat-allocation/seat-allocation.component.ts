import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { faExclamationTriangle, faCaretUp, faCaretDown, faSyncAlt, faInfo, faFilePdf, faChevronUp, faChevronDown, faTrashAlt, faEllipsisV, faCheckCircle, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatExpansionPanel } from '@angular/material/expansion';

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

  parentPanelXpandStatus=false;
  customCollapsedHeight: string = 'auto';
  customExpandedHeight: string = 'auto';
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
    private sessionDialog: MatDialog) { }

  ngOnInit() { }

  // open dialog box to add/edit session
  openSessionDialog(session = null, index = null) {
    let newSession = session;
    const dialogRef = this.sessionDialog.open(SessionDialogComponent, {
      width: '600px',
      data: { session: newSession },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (newSession) {

        } else {
          this.advancedSessions.push({
            sessionName: result.sessionName,
            sessionsPrograms: result.sessionsPrograms,
            tables: []
          })
        }
      }
    });
  }

  // open dialog box to add/edit session table
  addEditSessionTable(sessionIndex, sessionTableIndex = null) {
    let dialogRef = this.sessionDialog.open(SessionTableDialogComponent, {
      panelClass: "mat-dialog-lg",
      width: "500px",
      data: {
        sessionTable: this.advancedSessions[sessionIndex].tables[sessionTableIndex]
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        if (sessionTableIndex != null) {
          this.advancedSessions[sessionIndex].tables[sessionTableIndex].tableName = response.tableName;
          this.advancedSessions[sessionIndex].tables[sessionTableIndex].tableSeats = response.tableSeats;
          this.advancedSessions[sessionIndex].tables[sessionTableIndex].tableColor = response.tableColor;
        } else {
          this.advancedSessions[sessionIndex].tables.push(response);
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

  onCancelClick() {
    this.dialogRef.close();
  }

  // remove program
  remove(program: string) {
    const index = this.sessionPrograms.indexOf(program);
    this.programs.push(program)
    this.programCtrl.setValue(null);
    if (index >= 0) {
      this.sessionPrograms.splice(index, 1);
    }
  }

  // select any program
  selected(event: MatAutocompleteSelectedEvent) {
    this.sessionPrograms.push(event.option.value);
    this.programs = this.programs.filter(ele => ele.id != event.option.value.id)
    this.programInput.nativeElement.value = '';
    this.programCtrl.setValue(null);
  }

  // async filter the programs
  private _filter(value: any) {
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


@Component({
  selector: "session-table-dialog",
  templateUrl: "session-table-dialog.component.html",
  styleUrls: ["./seat-allocation.component.scss"]
})
export class SessionTableDialogComponent {
  // declare variables 
  tableForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SessionTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {
    this.buildForm();
  }

  buildForm() {
    this.tableForm = this.formBuilder.group({
      tableName: [this.data.sessionTable ? this.data.sessionTable.tableName : "", Validators.required],
      tableSeats: [this.data.sessionTable ? this.data.sessionTable.tableSeats : "", Validators.required],
      tableColor: [this.data.sessionTable ? this.data.sessionTable.tableColor : "#ffffff"]
    });
  }

  // close the dialog box
  onClose() {
    this.dialogRef.close();
  }

  // get color and set in the form control
  getColor(color: string) {
    this.tableForm.patchValue({
      tableColor: color
    })
  }

  // save the session table
  saveSessionTable() {
    if (!this.tableForm.valid) {
      return;
    }
    this.dialogRef.close(this.tableForm.value);
  }

  // Form validations start
  get tableName() {
    return this.tableForm.get("tableName");
  }
  get tableSeats() {
    return this.tableForm.get("tableSeats");
  }
  // Form validations end
}