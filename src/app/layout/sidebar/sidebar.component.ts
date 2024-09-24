import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterModule] // Make sure RouterModule is imported
})
export class SidebarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Candidate Form',
        routerLink: '/'
      },

      {
        label: 'Interview Summary',
        routerLink: '/interview-summary'
      },
      {
        label:'Question-Page',
        routerLink:'/question-page'
      }
      // {
      //   label: 'status',
      //   routerLink: '/voc-status'
      // },
    ];
  }
}
