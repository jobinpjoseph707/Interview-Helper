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
          "technology": "Angular",
          "experience": "Senior",

          "percentage": 90
        },
        {
          "technology": "React",
          "experience": "Mid",

          "percentage": 80
        }
      ]
    },
    {
      "name": "Hellen Jackson",
      "date": "20-10-2021",
      "role": "Front End Developer",
      "overallPercentage": 85,
      "stacks": [
        {
          "technology": "Angular",
          "experience": "Senior",

          "percentage": 90
        },
        {
          "technology": "React",
          "experience": "Mid",

          "percentage": 80
        }
      ]
    },
    {
      "name": "Hellen Jackson",
      "date": "20-10-2021",
      "role": "Front End Developer",
      "overallPercentage": 85,
      "stacks": [
        {
          "technology": "Angular",
          "experience": "Senior",

          "percentage": 90
        },
        {
          "technology": "React",
          "experience": "Mid",

          "percentage": 80
        }
      ]
    },
    {
      "name": "Hellen Jackson",
      "date": "20-10-2021",
      "role": "Front End Developer",
      "overallPercentage": 85,
      "stacks": [
        {
          "technology": "Angular",
          "experience": "Senior",

          "percentage": 90
        },
        {
          "technology": "React",
          "experience": "Mid",

          "percentage": 80
        }
      ]
    },
    {
      "name": "Hellen Jackson",
      "date": "20-10-2021",
      "role": "Front End Developer",
      "overallPercentage": 85,
      "stacks": [
        {
          "technology": "Angular",
          "experience": "Senior",

          "percentage": 90
        },
        {
          "technology": "React",
          "experience": "Mid",

          "percentage": 80
        }
      ]
    },
    {
      "name": "Hellen Jackson",
      "date": "20-10-2021",
      "role": "Front End Developer",
      "overallPercentage": 85,
      "stacks": [
        {
          "technology": "Angular",
          "experience": "Senior",

          "percentage": 90
        },
        {
          "technology": "React",
          "experience": "Mid",

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
          "technology": "Vue.js",
          "experience": "Mid",

          "percentage": 75
        },
        {
          "technology": "React",
          "experience": "Fresher",

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
          "technology": "Node.js",
          "experience": "Senior",

          "percentage": 95
        },
        {
          "technology": "React",
          "experience": "Senior",

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
          "technology": "Node.js",
          "experience": "Mid",

          "percentage": 84
        },
        {
          "technology": "Django",
          "experience": "Fresher",

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
