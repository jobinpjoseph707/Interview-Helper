import { Component, HostListener, ViewChild } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav'; // Import MatSidenavModule
import { MatListModule } from '@angular/material/list'; // Import MatListModule

@Component({
  selector: 'app-navigation-panel',
  standalone: true,
  imports: [SidebarComponent,MatSidenavModule,MatListModule, HeaderComponent,RouterOutlet],
  templateUrl: './navigation-panel.component.html',
  styleUrl: './navigation-panel.component.scss'
})
export class NavigationPanelComponent {
  @ViewChild('sidenav') sidenav: any;
  isTabletOrSmaller = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }
  checkScreenSize() {
    this.isTabletOrSmaller = window.innerWidth < 768;
    if (this.sidenav) {
      if (this.isTabletOrSmaller) {
        this.sidenav.close();
      } else {
        this.sidenav.open();
      }
    }
  }

  // checkScreenSize() {
  //   this.isTabletOrSmaller = window.innerWidth < 768;
  //   if (!this.isTabletOrSmaller && this.sidenav) {
  //     this.sidenav.open();
  //   }
  // }
}
