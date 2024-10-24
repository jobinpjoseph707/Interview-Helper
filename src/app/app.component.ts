import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { LoginComponent } from "./layout/login/login.component";
import { NavigationPanelComponent } from "./layout/navigation-panel/navigation-panel.component";
import { LoaderComponent } from "./ui/loader/loader.component"; // Import MatSidenavModule
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav'; // Import MatSidenav
import { filter } from 'rxjs';
import { NgIf } from '@angular/common';

// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf,RouterOutlet, HeaderComponent, SidebarComponent, MatSidenavModule, LoginComponent, NavigationPanelComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // title = 'Interview-Helper';
  // @ViewChild('sidenav') sidenav!: MatSidenav;
  // isSmallScreen = false;

  // constructor(private breakpointObserver: BreakpointObserver) {}

  // ngOnInit() {
  //   this.breakpointObserver
  //     .observe(['(max-width: 756px)'])
  //     .subscribe(result => {
  //       this.isSmallScreen = result.matches;
  //       if (!this.isSmallScreen) {
  //         this.sidenav?.open();
  //       } else {
  //         this.sidenav?.close();
  //       }
  //     });
  // }

  // onToggleSidenav() {
  //   this.sidenav.toggle();
  // }
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSmallScreen = false;
  isModalOpen = false;
  isLoginPage = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    // Subscribe to router events to detect current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Update isLoginPage based on current route
        this.isLoginPage = event.url === '/login' || event.url === '/';
      }
    });
  }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 756px)'])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
        if (!this.isSmallScreen && !this.isLoginPage) {
          this.sidenav?.open();
        } else {
          this.sidenav?.close();
        }
      });
  }

  onToggleSidenav() {
    this.sidenav.toggle();
  }

  onSidenavOpen() {
    if (this.isSmallScreen) {
      document.body.style.overflow = 'hidden';
    }
  }

  onSidenavClose() {
    document.body.style.overflow = 'auto';
  }

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  confirmModal() {
    // Handle confirmation logic here
    this.closeModal();
  }
}

