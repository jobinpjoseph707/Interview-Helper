<<<<<<< HEAD
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
=======


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { CandidatePageComponent } from "./pages/candidate-page/candidate-page.component";
>>>>>>> 63b7f755d719aa2dc2145748d796b4dee8268806

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet],
=======
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CandidatePageComponent],
>>>>>>> 63b7f755d719aa2dc2145748d796b4dee8268806
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
<<<<<<< HEAD
  title = 'visitor-management-system';
=======
  title = 'Interview-Helper';
>>>>>>> 63b7f755d719aa2dc2145748d796b4dee8268806
}
