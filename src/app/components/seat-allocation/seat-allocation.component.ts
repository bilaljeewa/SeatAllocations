import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seat-allocation',
  templateUrl: './seat-allocation.component.html',
  styleUrls: ['./seat-allocation.component.scss']
})
export class SeatAllocationComponent implements OnInit {
  
  visible = true;
  selectable = true;
  removable = true;

  Session: string[] = ['Dinner Gala','Sponsor','Speakers'];
  
  constructor() { }

  ngOnInit() {
  }

}
