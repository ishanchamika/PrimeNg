import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnchangeComponent } from '../onchange/onchange.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CommonModule, FormsModule, OnchangeComponent], // Import child component
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent 
{
  // constructor() { }

  ngOnInit(): void 
  {
    console.log('Parent Component Initialized');
  }
  parentValue: string = '';
}
