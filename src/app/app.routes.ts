import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/candidate-page/candidate-page.component').then((m) => m.CandidatePageComponent),
  },
  {
    path: 'question-page',
    loadComponent: () => import('./pages/questionpage/questionpage.component').then((m) => m.QuestionpageComponent),
  },
  // {
  //   path: 'voc-analysis',
  //   loadComponent: () => import('./pages/voc-analysis/voc-analysis.component').then((m) => m.VocAnalysisComponent),

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
