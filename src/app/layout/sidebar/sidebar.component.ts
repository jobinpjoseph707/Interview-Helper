import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav'; // Import MatSidenavModule
import { MatListModule } from '@angular/material/list'; // Import MatListModule
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [MatIcon,RouterModule,MatSidenavModule,MatListModule, MatTooltipModule]
})
export class SidebarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    // this.items = [
    //   {
    //     label: 'Candidate Form',
    //     routerLink: '/interview-helper/Candidate-Forms'
    //   },

    //   {
    //     label: 'Interview Summary',
    //     routerLink: '/interview-helper/interview-summarys/'
    //   },
    //   {
    //     label:'Question-Page',
    //     routerLink:'/interview-helper/question-pages'
    //   }
    // ];
  }
  isSidenavOpen = true; // Default sidenav open on larger screens

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
