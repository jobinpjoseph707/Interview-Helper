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
      // Uncomment these when the routes are available
      // {
      //   label: 'analysis',
      //   routerLink: '/voc-analysis'
      // },
      // {
      //   label: 'status',
      //   routerLink: '/voc-status'
      // },
    ];
  }
}
