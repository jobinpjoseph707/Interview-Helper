import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  isLoading = false;

  constructor(private loaderService: LoaderService) {
    // Subscribe to loader state changes
    console.log("loader active");
    
    this.loaderService.loading$.subscribe(
      
      (state: boolean) => (this.isLoading = state)
    );
  }
}
