import { Component, OnInit, OnChanges, SimpleChanges, Input ,OnDestroy} from '@angular/core';
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

  constructor() 
  {
    console.log('Constructor.......');
  }

  ngOnInit(): void 
  {
    console.log('Child Component Initialized');
  }

  ngOnChanges(changes: SimpleChanges): void 
  {
    if(changes['inputValue']) 
    {
      console.log('Previous Value:', changes['inputValue'].previousValue);
      console.log('Current Value:', changes['inputValue'].currentValue);
    }
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy - Cleanup before component is removed");
  }
}
