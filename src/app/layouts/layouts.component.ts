import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftnavbartreeComponent } from '../leftnavbartree/leftnavbartree.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  standalone: true,
  imports: [RouterOutlet,LeftnavbartreeComponent,HeaderComponent],
  styleUrl: './layouts.component.css',
})
export class LayoutsComponent {
  showHideTree(e: any) {}
}
