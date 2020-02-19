import { Component, OnInit, Inject } from '@angular/core';
import { faExclamationTriangle, faCaretUp, faSyncAlt, faInfo, faFilePdf, faChevronUp, faTrashAlt, faEllipsisV ,faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

export interface SessionDialogData {
  programs: string;
  name: string;
}

export interface SessionPrograms {
  name: string;
}

export interface SessionUnallocated {
  name: string;
}

const ELEMENT_DATA: SessionUnallocated[] = [
  {name: 'Hydrogen'},
  {name: 'Helium'},
  {name: 'Lithium'},
  {name: 'Beryllium'},
  {name: 'Boron'},
  {name: 'Carbon'},
  {name: 'Nitrogen'},
  {name: 'Oxygen'},
  {name: 'Fluorine'},
  {name: 'Neon'},
];

@Component({
  selector: 'app-seat-allocation',
  templateUrl: './seat-allocation.component.html',
  styleUrls: ['./seat-allocation.component.scss']
})
export class SeatAllocationComponent implements OnInit {

  programs: string;
  name: string;
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
  
  
  visible = true;
  selectable = true;
  removable = true;

  sessionPrograms: string[] = ['Dinner Gala','Sponsor','Speakers'];
  
  /**checked table **/
  displayedColumns: string[] = ['select',  'name',  'symbol'];
  dataSource = new MatTableDataSource<SessionUnallocated>(ELEMENT_DATA);
  selection = new SelectionModel<SessionUnallocated>(true, []);

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
  fernolumns: string[] = ['image', 'name', 'symbol' ];
  constructor(
    public sessionDialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openSessionDialog(): void {
    const dialogRef = this.sessionDialog.open(SessionDialogComponent, {
      width: '45%',
      data: {name: 'Session Name', programs: 'Programs List'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.programs = result;
    });
  }

}


@Component({
  selector: 'session-dialog.component',
  templateUrl: 'session-dialog.component.html',
  styleUrls: ['./seat-allocation.component.scss']
})
export class SessionDialogComponent {

  programCtrl = new FormControl();
  filteredPrograms: Observable<SessionPrograms[]>;

  programs: SessionPrograms[] = [
    {
      name: 'Arkansas'
    },
    {
      name: 'California'
    },
    {
      name: 'Florida'
    },
    {
      name: 'Texas'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SessionDialogData) {
      this.filteredProgramChanges()
    }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  filteredProgramChanges() {
    this.filteredPrograms = this.programCtrl.valueChanges
    .pipe(
      startWith(''),
      map(program => program ? this._filterPrograms(program) : this.programs.slice())
    );
  }

  private _filterPrograms(value: string): SessionPrograms[] {
    const filterValue = value.toLowerCase();

    return this.programs.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
