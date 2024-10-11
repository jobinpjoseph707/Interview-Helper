import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { LoginComponent } from "./layout/login/login.component";
import { NavigationPanelComponent } from "./layout/navigation-panel/navigation-panel.component"; // Import MatSidenavModule

// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, MatSidenavModule, LoginComponent, NavigationPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Interview-Helper';
}
