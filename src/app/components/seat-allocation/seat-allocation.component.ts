import { Component, OnInit, Inject } from '@angular/core';
import { faExclamationTriangle, faCaretUp, faCaretDown, faSyncAlt, faInfo, faFilePdf, faChevronUp, faChevronDown, faTrashAlt, faEllipsisV, faCheckCircle, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  mainPanelIcon: number = -1;
  innerPanelIcon: number = -1;
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
    let existingSession = session;
    const dialogRef = this.sessionDialog.open(SessionDialogComponent, {
      width: '600px',
      data: { session: existingSession },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (existingSession) {
          this.advancedSessions[index].sessionName = result.sessionName
          this.advancedSessions[index].sessionsPrograms = result.sessionsPrograms
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

  // expansion panel code for future use starts
  // beforePanelClosed(panel){
  //   panel.isExpanded = false;
  //   console.log("Panel going to close!");
  // }
  // beforePanelOpened(panel){
  //   panel.isExpanded = true;
  //   console.log("Panel going to  open!");
  // }
  // expansion panel code for future use ends

  // main expansion pannel open and closed controls handeling starts
  afterPanelClosed(i) {
    var preval = this.mainPanelIcon;
    if (preval < i) {
      this.mainPanelIcon = preval;
    } else {
      this.mainPanelIcon = -1;
    }
  }

  afterPanelOpened(i) {
    this.mainPanelIcon = i;
  }
  // main expansion pannel open and closed controls handeling ends

  // inner expansion pannel open and closed constrols handeling starts
  innerPannelOpened(j) {
    this.innerPanelIcon = j;
  }

  innerPanelClosed(j) {
    var preval = this.innerPanelIcon;
    if (preval < j) {
      this.innerPanelIcon = preval;
    } else {
      this.innerPanelIcon = -1;
    }
  }
  // inner expansion pannel open and closed constrols handeling ends

  do(event) {
    event.preventDefault();
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

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };
  programs: any[] = [
    { id: 1, name: 'Dinner Gala' },
    { id: 2, name: 'Sponsors' },
    { id: 3, name: 'Lunch' },
    { id: 4, name: 'Trip' },
    { id: 5, name: 'Holiday' }
  ];
  sessionName: string = '';
  sessionPrograms = [];
  errorMessage: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.session) {
      this.sessionName = this.data.session.sessionName;
      this.sessionPrograms = this.data.session.sessionsPrograms;
    }
  }

  onCancelClick() {
    this.dialogRef.close();
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