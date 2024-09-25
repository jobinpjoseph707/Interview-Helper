import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewReportService {

  // Hardcoded JSON data
  private reports = [
    {
      "name": "Hellen Jackson",
      "date": "20-10-2021",
      "role": "Front End Developer",
      "overallPercentage": 85,
      "stacks": [
        {
          "stackName": "Angular",
          "experience": "Senior",
          "technologies": ["TypeScript", "RxJS", "HTML", "CSS"],
          "percentage": 90
        },
        {
          "stackName": "React",
          "experience": "Mid",
          "technologies": ["JavaScript", "Redux", "React Router"],
          "percentage": 80
        }
      ]
    },
    {
      "name": "Alan Tom Andrews",
      "date": "20-10-2021",
      "role": "Front End Developer",
      "overallPercentage": 78,
      "stacks": [
        {
          "stackName": "Vue.js",
          "experience": "Mid",
          "technologies": ["Vuex", "Vuetify", "JavaScript"],
          "percentage": 75
        },
        {
          "stackName": "React",
          "experience": "Fresher",
          "technologies": ["Hooks", "Context API"],
          "percentage": 80
        }
      ]
    },
    {
      "name": "Lakshmi Menon",
      "date": "20-10-2021",
      "role": "Full Stack Developer",
      "overallPercentage": 92,
      "stacks": [
        {
          "stackName": "Node.js",
          "experience": "Senior",
          "technologies": ["Express", "MongoDB", "JWT"],
          "percentage": 95
        },
        {
          "stackName": "React",
          "experience": "Senior",
          "technologies": ["Redux", "Context API"],
          "percentage": 89
        }
      ]
    },
    {
      "name": "Jon B",
      "date": "20-10-2021",
      "role": "Back End Developer",
      "overallPercentage": 82,
      "stacks": [
        {
          "stackName": "Node.js",
          "experience": "Mid",
          "technologies": ["Express", "Mongoose", "JWT"],
          "percentage": 84
        },
        {
          "stackName": "Django",
          "experience": "Fresher",
          "technologies": ["Python", "REST Framework"],
          "percentage": 80
        }
      ]
    }
  ];

  constructor() {}

  // Return the hardcoded data as an observable
  getInterviewReports(): Observable<any> {
    return of(this.reports);
  }
}
