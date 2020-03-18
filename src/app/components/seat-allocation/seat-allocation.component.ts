import { Component, OnInit, Inject } from '@angular/core';
import { faExclamationTriangle, faCaretUp, faCaretDown, faSyncAlt, faInfo, faFilePdf, faChevronUp, faChevronDown, faTrashAlt, faEllipsisV, faCheckCircle, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeatallocationService } from 'src/app/services/seatallocation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

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
  programs = new Array();
  eventID = "";

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
    private sessionDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private toast: ToastrService,
    private seatallocationService: SeatallocationService) { }

  ngOnInit() {
    let currentURL = window.location.href;
    this.eventID = currentURL.substring(currentURL.indexOf("EventKey=") + 9, currentURL.indexOf("&"));
    // localStorage.setItem('eventID', currentURL.substring(currentURL.indexOf("EventKey=") + 9, currentURL.indexOf("&")));
    this.getPrograms();
  }

  // fetch the programs as per the current EventID
  async getPrograms() {
    this.seatallocationService.getPrograms(this.eventID).subscribe(
      result => {
        if (result.length > 0) {
          let Functions = new Array();
          let RegistrationOptions = new Array();
          if (result[0].Functions.$values.length > 0) {
            Functions = result[0].Functions.$values.map((x: any) =>
              (<any>
                {
                  "EventFunctionId": x.EventFunctionId,
                  "EventFunctionCode": x.EventFunctionCode,
                  "Name": x.Name,
                  "Description": x.Description
                }))
          }
          if (result[0].RegistrationOptions.$values.length > 0) {
            RegistrationOptions = result[0].RegistrationOptions.$values.map((x: any) =>
              (<any>
                {
                  "EventFunctionId": x.EventFunctionId,
                  "EventFunctionCode": x.EventFunctionCode,
                  "Name": x.Name,
                  "Description": x.Description
                }))
          }
          this.programs = Functions.concat(RegistrationOptions);
          this.getSessions();
        }
      }, error => {
        this.toast.error("Something went wrong!! Please try again later!!", "Error");
      }
    )
  }

  // fetch the sessions as per the current EventID
  async getSessions() {
    this.seatallocationService.getSessions(this.eventID).subscribe(
      result => {
        this.advancedSessions = [];
        this.mainPanelIcon = -1;
        this.innerPanelIcon = -1;
        if (result.length > 0) {
          result.map((ele: any, index) => {
            this.advancedSessions[index] = []
            ele.Properties.$values.map(ele1 => {
              if (ele1.Name == 'Programs') {
                this.advancedSessions[index][ele1.Name] = ele1.Value.split(",");
                this.advancedSessions[index]["programNames"] = []
                ele1.Value.split(",").map(ele2 => {
                  let Name = this.programs.filter(ele => ele.EventFunctionId == ele2.trim());
                  this.advancedSessions[index]["programNames"].push(Name.length > 0 ? Name[0].Name : '')
                })
              } else {
                this.advancedSessions[index][ele1.Name] = typeof (ele1.Value) == 'object' ? ele1.Value.$value : ele1.Value;
              }
            })
          })
          this.getTables();
        }
      }, error => {
        this.toast.error("Something went wrong!! Please try again later!!", "Error");
      }
    )
  }

  // fetch the tables as per the current EventID
  async getTables() {
    this.seatallocationService.getTables(this.eventID).subscribe(
      result => {
        let abc = [];
        if (result.length > 0) {
          result.map((ele: any, index) => {
            abc[index] = []
            ele.Properties.$values.map(ele1 => {
              abc[index][ele1.Name] = typeof (ele1.Value) == 'object' ? ele1.Value.$value : ele1.Value;
            })
          })
          this.advancedSessions.map(ele => {
            ele['tables'] = abc.filter(ele1 => ele1.SessionID == ele.Ordinal);
          })
        }
        this.getRegitrants();
      }, error => {
        this.toast.error("Something went wrong!! Please try again later!!", "Error");
      }
    )
  }

  // fetch the registrants as per the current EventID
  async getRegitrants() {
    this.seatallocationService.getRegistrants(this.eventID).subscribe(
      result => {
        let abc = [];
        if (result.length > 0) {
          result.map((ele: any, index) => {
            abc[index] = []
            ele.Properties.$values.map(ele1 => {
              abc[index][ele1.Name] = typeof (ele1.Value) == 'object' ? ele1.Value.$value : ele1.Value;
            })
          })
          this.advancedSessions.map(ele => {
            ele['unallocatedRegistrants'] = abc.filter(ele1 => ele1.SessionID == ele.Ordinal && ele1.TableID == 0);
            ele['allocatedRegistrants'] = abc.filter(ele1 => ele1.SessionID == ele.Ordinal && ele1.TableID != 0);
          })
        }
        console.log(this.advancedSessions)
      }, error => {
        this.toast.error("Something went wrong!! Please try again later!!", "Error");
      }
    )
  }

  // open dialog box to add/edit session
  openSessionDialog(session = null, sessionIndex = null) {
    let existingSession = session;
    const dialogRef = this.sessionDialog.open(SessionDialogComponent, {
      width: '600px',
      data: { session: existingSession, programs: this.programs, eventID: this.eventID },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response.type == 'add') {
        if (response.data && response.data.length > 0) {
          let programNamesWithQuotes = '"' + response.data[0].Properties.$values.filter(ele => ele.Name == 'Programs')[0].Value.split(",").join('","') + '"';
          console.log(programNamesWithQuotes);
          this.seatallocationService.getIQARegistrants(programNamesWithQuotes).subscribe(
            (result: any) => {
              if (result.length > 0) {
                let RegistrantsDetails = [];
                result = result.filter((thing, index, self) =>
                  index === self.findIndex((t) => (
                    t.Properties.$values.filter(ele1 => ele1.Name == 'RegistrantID')[0].Value === thing.Properties.$values.filter(ele1 => ele1.Name == 'RegistrantID')[0].Value
                  ))
                )
                result.map((ele, index) => {
                  let RegistrantID = ele.Properties.$values.filter(ele1 => ele1.Name == 'RegistrantID');
                  let FullName = ele.Properties.$values.filter(ele1 => ele1.Name == 'FullName');
                  RegistrantsDetails.push({
                    "$type": "Asi.Soa.Core.DataContracts.GenericEntityData, Asi.Contracts",
                    "EntityTypeName": "Psc_Event_Registrant",
                    "PrimaryParentEntityTypeName": "Standalone",
                    "Identity": {
                      "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
                      "EntityTypeName": "Psc_Event_Registrant",
                      "IdentityElements": {
                        "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
                        "$values": [""]
                      }
                    },
                    "PrimaryParentIdentity": {
                      "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
                      "EntityTypeName": "Standalone",
                      "IdentityElements": {
                        "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
                        "$values": [""]
                      }
                    },
                    "Properties": {
                      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyDataCollection, Asi.Contracts",
                      "$values": [{
                        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
                        "Name": "SessionID",
                        "Value": {
                          "$type": "System.Int32",
                          "$value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'Ordinal')[0].Value.$value
                        }
                      },
                      {
                        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
                        "Name": "EventID",
                        "Value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'EventID')[0].Value
                      },
                      {
                        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
                        "Name": "RegistrantID",
                        "Value": RegistrantID[0].Value
                      },
                      {
                        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
                        "Name": "RegistrantName",
                        "Value": FullName[0].Value
                      },
                      {
                        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
                        "Name": "SortOrder",
                        "Value": {
                          "$type": "System.Int32",
                          "$value": 0
                        }
                      },
                      {
                        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
                        "Name": "TableID",
                        "Value": {
                          "$type": "System.Int32",
                          "$value": 0
                        }
                      }
                      ]
                    }
                  })
                  if (result.length == index + 1) {
                    let increamentedValue = 0;
                    RegistrantsDetails.map((RegistrantElement, RegistrantIndex) => {
                      this.seatallocationService.addRegistrant(RegistrantElement).subscribe(
                        RegistrantResult => {
                          increamentedValue = increamentedValue + 1;
                          if (increamentedValue == RegistrantsDetails.length) {
                            this.seatallocationService.getRegistrants(response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'EventID')[0].Value, response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'Ordinal')[0].Value.$value).subscribe(
                              (RegistrantsResult: any) => {
                                this.updateSession(response, RegistrantsResult.Items.$values.length);
                              }, RegistrantsError => {
                                this.toast.error("Something went wrong!! Please try again later!!", "Error");
                              }
                            )
                          }
                        }, RegistrantError => {
                          this.toast.error("Something went wrong!! Please try again later!!", "Error");
                        }
                      )
                    })
                  }
                })
              } else {
                this.getPrograms();
              }
            }, error => {
              this.toast.error("Something went wrong!! Please try again later!!", "Error");
            }
          )
        }
        // this.getPrograms();
      } else if (response.type == 'Edit') {
        this.getPrograms();
      } else if (response.type == 'delete') {
        this.getPrograms();
        // this.advancedSessions.splice(sessionIndex, 1);
      }
    });
  }

  // open dialog box to add/edit session table
  addEditSessionTable(sessionIndex, sessionTableIndex = null) {
    let dialogRef = this.sessionDialog.open(SessionTableDialogComponent, {
      panelClass: "mat-dialog-lg",
      width: "500px",
      data: {
        sessionTable: sessionTableIndex ? this.advancedSessions[sessionIndex].tables[sessionTableIndex] : null,
        session: this.advancedSessions[sessionIndex],
        eventID: this.eventID
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response.type == 'addEdit' || response.type == 'delete') {
        this.getPrograms();
      }
      // else if (response.type == 'delete') {
      //   this.advancedSessions[sessionIndex].tables.splice(sessionTableIndex, 1);
      // }
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
  // inner expansion pannel open and closed constrols handling ends

  do(event) {
    event.preventDefault();
  }

  // remove session program from the session programs chips
  removeSessionProgram(programIndex: number, sessionIndex: number) {
    this.matSnackBar.open(`Delete ${this.advancedSessions[sessionIndex].Programs[programIndex].name}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.advancedSessions[sessionIndex].Programs.splice(programIndex, 1);
      });
  }

  // update new session
  async updateSession(response, UnallocatedRegistrants) {
    let sessionData = new Array();
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "Ordinal",
      "Value": { "$type": "System.Int32", "$value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'Ordinal')[0].Value.$value }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalUnallocated",
      "Value": { "$type": "System.Int32", "$value": UnallocatedRegistrants }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalAllocated",
      "Value": { "$type": "System.Int32", "$value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'TotalAllocated')[0].Value.$value }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalSeats",
      "Value": { "$type": "System.Int32", "$value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'TotalSeats')[0].Value.$value }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalTables",
      "Value": { "$type": "System.Int32", "$value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'TotalTables')[0].Value.$value }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "Programs",
      "Value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'Programs')[0].Value
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "SessionName",
      "Value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'SessionName')[0].Value
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "EventID",
      "Value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'EventID')[0].Value
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "SessionTimeStamp",
      "Value": response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'SessionTimeStamp')[0].Value
    })

    this.seatallocationService.updateSession({ sessionID: response.data[0].Properties.$values.filter(ele1 => ele1.Name == 'Ordinal')[0].Value.$value, session: sessionData }).subscribe(
      result => {
        this.getPrograms();
      }, error => {
        this.toast.error("Something went wrong!! Please try again later!!", "Error");
      }
    )
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
    idField: 'EventFunctionId',
    textField: 'Name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };
  SessionName: string = '';
  sessionPrograms = [];
  errorMessage: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matSnackBar: MatSnackBar,
    private toast: ToastrService,
    private seatallocationService: SeatallocationService) {
    this.sessionPrograms = [];

    if (this.data.session) {
      this.SessionName = this.data.session.SessionName;
      this.data.session.Programs.map(ele => {
        let program = this.data.programs.filter(ele1 => ele1.EventFunctionId == ele.trim())
        this.sessionPrograms.push(program[0]);
      })
    }
  }

  // close the dialog box
  onClose() {
    this.dialogRef.close({
      type: 'close'
    });
  }

  // save the session
  async saveSession() {
    if (!this.SessionName || this.sessionPrograms.length == 0) {
      this.errorMessage = true;
      return;
    }
    this.errorMessage = false;
    let filteredPrograms = new Array();
    this.sessionPrograms.map(ele => {
      filteredPrograms.push(ele.EventFunctionId);
    })
    let sessionData = new Array();
    if (this.data.session) {
      sessionData.push({
        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
        "Name": "Ordinal",
        "Value": { "$type": "System.Int32", "$value": this.data.session.Ordinal }
      })
    }
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalUnallocated",
      "Value": { "$type": "System.Int32", "$value": this.data.session ? this.data.session.TotalUnallocated : 0 }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalAllocated",
      "Value": { "$type": "System.Int32", "$value": this.data.session ? this.data.session.TotalAllocated : 0 }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalSeats",
      "Value": { "$type": "System.Int32", "$value": this.data.session ? this.data.session.TotalSeats : 0 }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalTables",
      "Value": { "$type": "System.Int32", "$value": this.data.session ? this.data.session.TotalTables : 0 }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "Programs",
      "Value": filteredPrograms.toString()
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "SessionName",
      "Value": this.SessionName
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "EventID",
      "Value": this.data.session ? this.data.session.EventID : this.data.eventID
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "SessionTimeStamp",
      "Value": this.data.session ? this.data.session.SessionTimeStamp : Math.floor(Date.now() / 1000)
    })
    let currentTimeStamp = this.data.session ? this.data.session.SessionTimeStamp : Math.floor(Date.now() / 1000);

    if (this.data.session) {
      this.seatallocationService.updateSession({ sessionID: this.data.session.Ordinal, session: sessionData }).subscribe(
        result => {
          if (result) {
            this.seatallocationService.getSessionByTimeStamp(currentTimeStamp).subscribe(
              result1 => {
                this.toast.success(`${this.SessionName} is updated successfully`, "Updated Success");
                this.dialogRef.close({
                  type: 'Edit',
                  data: result1
                });
              }, error1 => {
                this.toast.error("Something went wrong!! Please try again later!!", "Error");
              }
            )
          } else {
            this.toast.error("Something went wrong!! Please try again later!!", "Error");
          }
        }, error => {
          this.toast.error("Something went wrong!! Please try again later!!", "Error");
        }
      )
    } else {
      this.seatallocationService.addSession({ session: sessionData }).subscribe(
        result => {
          if (result) {
            this.seatallocationService.getSessionByTimeStamp(currentTimeStamp).subscribe(
              result1 => {
                this.toast.success(`${this.SessionName} is added successfully`, "Added Success");
                this.dialogRef.close({
                  type: 'add',
                  data: result1
                });
              }, error1 => {
                this.toast.error("Something went wrong!! Please try again later!!", "Error");
              }
            )
          } else {
            this.toast.error("Something went wrong!! Please try again later!!", "Error");
          }
        }, error => {
          this.toast.error("Something went wrong!! Please try again later!!", "Error");
        }
      )
    }
  }

  // delete the table
  onDelete() {
    this.matSnackBar.open(`Delete ${this.data.session.SessionName}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.seatallocationService.deleteSession(this.data.session.Ordinal).subscribe(
          result => {
            this.toast.success(`${this.data.session.SessionName} is deleted successfully`, "Deleted Success");
            this.dialogRef.close({
              type: 'delete'
            });
          }, error => {
            this.toast.error("Something went wrong!! Please try again later!!", "Error");
          }
        )
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
    private formBuilder: FormBuilder,
    private seatallocationService: SeatallocationService,
    private toast: ToastrService,
    private matSnackBar: MatSnackBar) {
    this.buildForm();
  }

  buildForm() {
    this.tableForm = this.formBuilder.group({
      TableName: [this.data.sessionTable ? this.data.sessionTable.TableName : "", Validators.required],
      NumSeats: [this.data.sessionTable ? this.data.sessionTable.NumSeats : 0, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      Colour: [this.data.sessionTable ? this.data.sessionTable.Colour : "#ffffff"]
    });
  }

  // close the dialog box
  onClose() {
    this.dialogRef.close({
      type: 'close'
    });
  }

  // get color and set in the form control
  getColor(color: string) {
    this.tableForm.patchValue({
      Colour: color
    })
  }

  // save the session table
  saveSessionTable() {
    if (!this.tableForm.valid) {
      this.tableForm.markAllAsTouched();
      return;
    }
    let tableData = new Array();
    if (this.data.sessionTable) {
      tableData.push({
        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
        "Name": "Ordinal",
        "Value": { "$type": "System.Int32", "$value": this.data.sessionTable.Ordinal }
      })
    }
    tableData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "Colour",
      "Value": this.tableForm.value.Colour
    })
    tableData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "NumSeats",
      "Value": { "$type": "System.Int32", "$value": this.tableForm.value.NumSeats }
    })
    tableData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TableName",
      "Value": this.tableForm.value.TableName
    })
    tableData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "SessionID",
      "Value": { "$type": "System.Int32", "$value": this.data.session.Ordinal }
    })
    tableData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "EventID",
      "Value": this.data.sessionTable ? this.data.sessionTable.EventID : this.data.eventID
    })

    let sessionData = new Array();
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "Ordinal",
      "Value": { "$type": "System.Int32", "$value": this.data.session.Ordinal }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalUnallocated",
      "Value": { "$type": "System.Int32", "$value": this.data.session.TotalUnallocated }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalAllocated",
      "Value": { "$type": "System.Int32", "$value": this.data.session.TotalAllocated }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalSeats",
      "Value": {
        "$type": "System.Int32", "$value": this.data.sessionTable ?
          (parseInt(this.data.session.TotalSeats) - parseInt(this.data.sessionTable.NumSeats)) + parseInt(this.tableForm.value.NumSeats)
          : parseInt(this.data.session.TotalSeats) + parseInt(this.tableForm.value.NumSeats)
      }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "TotalTables",
      "Value": { "$type": "System.Int32", "$value": this.data.sessionTable ? this.data.session.TotalTables : this.data.session.TotalTables + 1 }
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "Programs",
      "Value": this.data.session.Programs.join()
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "SessionName",
      "Value": this.data.session.SessionName
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "EventID",
      "Value": this.data.session.EventID
    })
    sessionData.push({
      "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
      "Name": "SessionTimeStamp",
      "Value": this.data.session.SessionTimeStamp
    })
    if (this.data.sessionTable) {
      this.seatallocationService.updateTable({ tableID: this.data.sessionTable.Ordinal, table: tableData }).subscribe(
        result => {
          if (result) this.updateSession(sessionData);
          else this.toast.error("Something went wrong!! Please try again later!!", "Error");
        }, error => {
          this.toast.error("Something went wrong!! Please try again later!!", "Error");
        }
      )
    } else {
      this.seatallocationService.addTable({ table: tableData }).subscribe(
        result => {
          if (result) this.updateSession(sessionData);
          else this.toast.error("Something went wrong!! Please try again later!!", "Error");
        }, error => {
          this.toast.error("Something went wrong!! Please try again later!!", "Error");
        }
      )
    }
  }

  // delete the table
  onDelete() {
    this.matSnackBar.open(`Delete ${this.data.sessionTable.TableName}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.seatallocationService.deleteTable(this.data.sessionTable.Ordinal).subscribe(
          result => {
            let sessionData = new Array();
            sessionData.push({
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "Ordinal",
              "Value": { "$type": "System.Int32", "$value": this.data.session.Ordinal }
            })
            sessionData.push({
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalUnallocated",
              "Value": { "$type": "System.Int32", "$value": this.data.session.TotalUnallocated }
            })
            sessionData.push({
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalAllocated",
              "Value": { "$type": "System.Int32", "$value": this.data.session.TotalAllocated }
            })
            sessionData.push({
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalSeats",
              "Value": { "$type": "System.Int32", "$value": this.data.session.TotalSeats }
            })
            sessionData.push({
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalTables",
              "Value": { "$type": "System.Int32", "$value": parseInt(this.data.session.TotalTables) - 1 }
            })
            sessionData.push({
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "Programs",
              "Value": this.data.session.Programs.join()
            })
            sessionData.push({
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "SessionName",
              "Value": this.data.session.SessionName
            })
            sessionData.push({
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "EventID",
              "Value": this.data.session.EventID
            })
            sessionData.push({
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "SessionTimeStamp",
              "Value": this.data.session.SessionTimeStamp
            })
            this.updateSession(sessionData, true);
          }, error => {
            this.toast.error("Something went wrong!! Please try again later!!", "Error");
          }
        )
      });
  }

  // update Session
  updateSession(sessionData, isDeleted = null) {
    this.seatallocationService.updateSession({ sessionID: this.data.session.Ordinal, session: sessionData }).subscribe(
      result => {
        if (result) {
          if (isDeleted) {
            this.toast.success(`${this.data.sessionTable.TableName} is deleted successfully`, "Deleted Success");
            this.dialogRef.close({
              type: 'delete'
            });
          } else {
            if (this.data.sessionTable) this.toast.success(`${this.tableForm.value.TableName} is updated successfully`, "Updated Success");
            else this.toast.success(`${this.tableForm.value.TableName} is added successfully`, "Added Success");
            this.dialogRef.close({
              type: 'addEdit',
              result
            });
          }
        } else {
          this.toast.error("Something went wrong!! Please try again later!!", "Error");
        }
      }, error => {
        this.toast.error("Something went wrong!! Please try again later!!", "Error");
      }
    )
  }

  // Form validations start
  get TableName() {
    return this.tableForm.get("TableName");
  }
  get NumSeats() {
    return this.tableForm.get("NumSeats");
  }
  // Form validations end
}