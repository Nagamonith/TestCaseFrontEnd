import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Required for <router-outlet>
import { CommonModule } from '@angular/common'; // Optional but useful

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontendApplication';
}