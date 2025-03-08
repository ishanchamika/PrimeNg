import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-custom-loader',
  standalone: true, // Add standalone property
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './custom-loader.component.html',
  styleUrls: ['./custom-loader.component.scss']
})
export class CustomLoaderComponent {
  @Input() isLoading: boolean = false;
}
