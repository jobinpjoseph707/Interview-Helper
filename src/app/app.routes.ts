import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationPanelComponent } from './layout/navigation-panel/navigation-panel.component';

export const routes: Routes = [
  {
      path:'interview-helper',    
    component:NavigationPanelComponent,
      children:[
        {
          path: 'candidate-form',
          loadComponent: () => import('./pages/candidate-page/candidate-page.component').then((m) => m.CandidatePageComponent),
        },
        {
          path: 'question-page',
          loadComponent: () => import('./pages/questionpage/questionpage.component').then((m) => m.QuestionpageComponent),
        },
        {
          path: 'interview-summary',
          loadComponent: () => import('./pages/interview-summary/interview-summary.component').then((m) => m.InterviewSummaryComponent),
      
        }

      ]
  },
  { path: '', redirectTo: 'interview-helper/candidate-form', pathMatch: 'full' }, // Default redirect
  { path: '**', redirectTo: 'interview-helper/candidate-form' } // Fallback route in case of unmatched paths
  // ,
  // {
  //   path: '',
  //   loadComponent: () => import('./pages/candidate-page/candidate-page.component').then((m) => m.CandidatePageComponent),
  // },
  // {
  //   path: 'question-page',
  //   loadComponent: () => import('./pages/questionpage/questionpage.component').then((m) => m.QuestionpageComponent),
  // },
  // {
  //   path: 'interview-summary',
  //   loadComponent: () => import('./pages/interview-summary/interview-summary.component').then((m) => m.InterviewSummaryComponent),

  // },
  // {
  //   path: 'voc-status',
  //   loadComponent: () => import('./pages/voc-status/voc-status.component').then((m) => m.VocStatusComponent),

  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
