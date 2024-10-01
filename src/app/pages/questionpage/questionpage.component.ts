import { Component } from '@angular/core';
import { Question, RoleResult } from '../../Models/questions.interface';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/question.service';
import { log } from 'console';

@Component({
  selector: 'app-questionpage',
  standalone: true,
  imports: [   MatDialogModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,MatCardModule,FormsModule,CommonModule,
  ],
  templateUrl: './questionpage.component.html',
  styleUrl: './questionpage.component.scss'
})
export class QuestionpageComponent {
  // timers: { minutes: number; seconds: number }[] = []; // Array to store the time for each question
  // activeQuestionIndex: number | null = null; // To track which timer is running
  // subscriptions: Subscription[] = []; // To store each timer's subscription
  isTimerRunning: boolean = false;
  
  timerInterval: any;
  seconds: number = 0;
  minutes: number = 0;
  currentTabIndex: number = 0; // Initialize with the first tab index
  // You may need to adjust this structure to fit your tab logic
  timers: { [key: string]: { seconds: number, isRunning: boolean, interval: any } } = {};
  

  reviewText: string = ''; // Variable to store the review text
  candidateId: number = 4596;
  candidateName: string = 'Jobin P Joseph';
  showResultsModal: boolean = false;
  showConfirmationModal: boolean = false; // New property for confirmation modal

  // roles: RoleResult[] = [
  //   {
  //     name: 'Front End',
  //     questions: [
  //       { id: 1, text: 'What is React?', role: 'Front End', answer: null },
  //       { id: 2, text: 'Explain CSS flexbox', role: 'Front End', answer: null },
  //       { id: 3, text: 'What is the Virtual DOM in React?', role: 'Front End', answer: null },
  //       { id: 4, text: 'What is the difference between class and functional components in React?', role: 'Front End', answer: null },
  //       { id: 5, text: 'What is a REST API?', role: 'Back End', answer: null },
  //       { id: 6, text: 'How do you manage state in React?', role: 'Front End', answer: null },
  //       { id: 7, text: 'What is an event loop in JavaScript?', role: 'Back End', answer: null },
  //       { id: 8, text: 'Explain the concept of closures in JavaScript.', role: 'Back End', answer: null },
  //       { id: 9, text: 'How do you optimize SQL queries?', role: 'Database', answer: null },
  //       { id: 10, text: 'What are SQL joins? Explain different types.', role: 'Database', answer: null },
  //       { id: 11, text: 'What is CORS, and how do you handle it in web applications?', role: 'Back End', answer: null },
  //       { id: 12, text: 'Explain the box model in CSS.', role: 'Front End', answer: null },
  //       { id: 13, text: 'What is normalization in databases?', role: 'Database', answer: null }
  //             ],

  //   },
  //   {
  //     name: 'Back End',
  //     questions: [
  //       { id: 3, text: 'What is Node.js?', role: 'Back End', answer: null },
  //       { id: 4, text: 'Explain database indexing', role: 'Back End', answer: null },
  //       // Add more back-end questions...
  //     ],

  //   }
  // ];
  isLoading: boolean = false;
  roles: RoleResult[] = [];

  overallPercentage: number = 83;
  tabs: string[] = ['Angular', 'Back End', 'Database/SQL'];
  activeTab: string = this.tabs[0];  // Set default active tab
 
  constructor(private questionService: QuestionService) {}

ngOnInit(){    

  this.loadQuestions();


}
loadQuestions() {
  this.isLoading = true;

  const technologies = [
    { technologyId: 1, experienceLevelId: 2 },
    { technologyId: 2, experienceLevelId: 2 }
  ];

  this.questionService.getQuestions(this.candidateId, technologies).subscribe({
    next: (data) => {
      this.roles = data;
      this.tabs = this.roles.map(role => role.name);
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error fetching questions:', error);
      this.isLoading = false;
    },
});
}

  ngOnDestroy() {
  }
  get filteredQuestions(): Question[] {
    const activeRole = this.roles.find(role => role.name === this.activeTab);
    return activeRole ? activeRole.questions : [];
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleTimer(questionId: number) {
    const timer = this.timers[questionId] || { seconds: 0, isRunning: false, interval: null };
  
    if (timer.isRunning) {
      clearInterval(timer.interval);
      timer.isRunning = false;
      // You may want to update the timer state in your timers object
    } else {
      timer.interval = setInterval(() => {
        timer.seconds++;
      }, 1000);
      timer.isRunning = true;
    }
  
    // Update the timers object
    this.timers[questionId] = timer;
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(secs)}`;
  }
  
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  

  submitAnswer(questionId: string) {
    // Logic for submitting the answer...
  
    // Stop the timer for this question
    const timer = this.timers[questionId];
    if (timer && timer.isRunning) {
      clearInterval(timer.interval);
      timer.isRunning = false;
    }
  
    // Reset timer seconds if needed, or leave it as is
  }
  
 
  answerQuestion(questionId: number, answer: 'correct' | 'incorrect' ) {
    this.roles.forEach(role => {
      const question = role.questions.find(q => q.id === questionId);
      if (question) {
        question.answer = answer;
      }
    });
  }
  calculateResults() {
    let totalRight = 0;
    let totalQuestions = 0;

    this.roles.forEach(role => {
      const details = {
        right: 0,
        wrong: 0,
        skipped: 0
      };

      role.questions.forEach(question => {
        switch (question.answer) {
          case 'correct':
            details.right++;
            totalRight++;
            break;
          case 'incorrect':
            details.wrong++;
            break;
        }
      });

      const totalAnswered = details.right + details.wrong;
      role.details = details;
      role.percentage = totalAnswered > 0 ? Math.round((details.right / totalAnswered) * 100) : 0;

      totalQuestions += role.questions.length;
    });

    this.overallPercentage = Math.round((totalRight / totalQuestions) * 100);
  }

  finishInterview() {  
    this.showConfirmationModal = true; // Show confirmation modal instead of results

  } 
  confirmFinish() {
    this.showConfirmationModal = false;
    this.calculateResults();
    this.showResultsModal = true;
  }


  downloadResults() {
    // Implement download logic here
    console.log('Downloading results...');
  }

  setRoleExpanded(role: any, expanded: boolean) {
    role.expanded = expanded;  // Set the expanded state manually based on the event
  }
  cancelFinish() {
    this.showConfirmationModal = false;
  }

  closeModal() {
    this.showResultsModal = false;
    // this.showConfirmationModal = false;
  }

  logChange(questionText: string, answer: 'correct' | 'incorrect' | 'skip') {  
    console.log(`Question "${questionText}" answered as "${answer}".`);  
  }  
 
}
