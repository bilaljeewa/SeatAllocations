import { Component, OnInit } from '@angular/core';
import { faExclamationTriangle, faCaretUp, faSyncAlt, faInfo, faFilePdf, faChevronUp, faTrashAlt, faEllipsisV ,faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

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
  constructor() { }

  ngOnInit() {
  }

}
