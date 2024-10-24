import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationPanelComponent } from './layout/navigation-panel/navigation-panel.component';
import { LoginComponent } from './layout/login/login.component';
import { ExitQuestionGuard } from './guard/exit-question.guard';
export const routes: Routes = [
  
  // {
  //     path:'interview-helper',
  //   component:NavigationPanelComponent,
  //     children:[
  //       {path:'',component:LoginComponent

  //       },

  //       {
  //         path: 'candidate-form',
  //         loadComponent: () => import('./pages/candidate-page/candidate-page.component').then((m) => m.CandidatePageComponent),
  //       },
  //       {
  //         path: 'question-page',
  //         loadComponent: () => import('./pages/questionpage/questionpage.component').then((m) => m.QuestionpageComponent),
  //                 canDeactivate: [ExitQuestionGuard], // Apply the guard here

  //       },
  //       {
  //         path: 'interview-summary',
  //         loadComponent: () => import('./pages/interview-summary/interview-summary.component').then((m) => m.InterviewSummaryComponent),

  //       }

  //     ]
  // },
  // { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default redirect
  // { path: '**', redirectTo: 'login' } // Fallback route in case of unmatched paths
  // ,
  {path:'',component:LoginComponent
  },
  {
    path: 'candidate-form',
    loadComponent: () => import('./pages/candidate-page/candidate-page.component').then((m) => m.CandidatePageComponent),
  },
  {
    path: 'question-page',
    loadComponent: () => import('./pages/questionpage/questionpage.component').then((m) => m.QuestionpageComponent),
                      canDeactivate: [ExitQuestionGuard], // Apply the guard here

  },

  {
    path: 'interview-summary',
    loadComponent: () => import('./pages/interview-summary/interview-summary.component').then((m) => m.InterviewSummaryComponent),

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
