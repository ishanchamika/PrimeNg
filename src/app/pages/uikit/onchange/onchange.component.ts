import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onchange',
  standalone: true,
  imports: [CommonModule], // Standalone component
  templateUrl: './onchange.component.html',
  styleUrls: ['./onchange.component.scss']
})
export class OnchangeComponent implements OnInit, OnChanges 
{
  @Input() inputValue: string = '';

  constructor() { }

  ngOnInit(): void {
    console.log('Child Component Initialized');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputValue']) {
      console.log('Previous Value:', changes['inputValue'].previousValue);
      console.log('Current Value:', changes['inputValue'].currentValue);
    }
  }
}
