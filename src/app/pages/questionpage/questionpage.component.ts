import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Question, RoleResult } from '../../Models/questions.interface';


@Component({
  selector: 'app-questionpage',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './questionpage.component.html',
  styleUrl: './questionpage.component.scss'
})
export class QuestionpageComponent {
  minutes: number = 0;
  seconds: number = 0;
  isTimerRunning: boolean = false;
  timerInterval: any;



  candidateId: string = '4596';
  candidateName: string = 'Jobin P Joseph';
  showResultsModal: boolean = false;
  // showConfirmationModal: boolean = false; // New property for confirmation modal

  roles: RoleResult[] = [
    {
      name: 'Front End',
      questions: [
        { id: 1, text: 'What is React?', role: 'Front End', answer: null },
        { id: 2, text: 'Explain CSS flexbox', role: 'Front End', answer: null },
        // Add more front-end questions...
      ],
      expanded: false  // Initialize the expanded property

    },
    {
      name: 'Back End',
      questions: [
        { id: 3, text: 'What is Node.js?', role: 'Back End', answer: null },
        { id: 4, text: 'Explain database indexing', role: 'Back End', answer: null },
        // Add more back-end questions...
      ],
      expanded: false  // Initialize the expanded property

    }
  ];
  overallPercentage: number = 83;
  activeTab: string = 'Front End';  // Set default active tab
  tabs: string[] = ['Front End', 'Back End', 'Database/SQL']; 

  ngOnDestroy() {
    this.stopTimer();
  }
  get filteredQuestions(): Question[] {
    const activeRole = this.roles.find(role => role.name === this.activeTab);
    return activeRole ? activeRole.questions : [];
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  toggleTimer() {
    if (this.isTimerRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
    this.isTimerRunning = !this.isTimerRunning;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.seconds++;
      if (this.seconds >= 60) {
        this.seconds = 0;
        this.minutes++;
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
   
 
  answerQuestion(questionId: number, answer: 'correct' | 'incorrect' | 'skip') {
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
          case 'skip':
            details.skipped++;
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
    // this.showConfirmationModal = true; // Show confirmation modal instead of results

    console.log('Interview finished'); 
    this.calculateResults(); 
    this.showResultsModal = true;

  } 
  // confirmFinish() {
  //   this.showConfirmationModal = false;
  //   this.calculateResults();
  //   this.showResultsModal = true;
  // }


  downloadResults() {
    // Implement download logic here
    console.log('Downloading results...');
  }

  toggleRoleExpansion(role: any) {
    role.expanded = !role.expanded;
  }
  // cancelFinish() {
  //   this.showConfirmationModal = false;
  // }

  closeModal() {
    this.showResultsModal = false;
    // this.showConfirmationModal = false;
  }

  logChange(questionText: string, answer: 'correct' | 'incorrect' | 'skip') {  
    console.log(`Question "${questionText}" answered as "${answer}".`);  
  }  
 
}
