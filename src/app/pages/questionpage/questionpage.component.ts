import { Component } from '@angular/core';
import { Question, QuestionRequest, RoleResult } from '../../Models/questions.interface';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/question.service';
import { log } from 'console';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar'

@Component({
  selector: 'app-questionpage',
  standalone: true,
  imports: [   MatDialogModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,MatCardModule,FormsModule,CommonModule,
  ],
  templateUrl:'./questionpage.component.html',
  styleUrl:'./questionpage.component.scss'
})
export class QuestionpageComponent {


  isTimerRunning: boolean = false;

  timerInterval: any;
  seconds: number = 0;
  minutes: number = 0;
  currentTabIndex: number = 0; // Initialize with the first tab index
  timers: { [key: string]: { seconds: number, isRunning: boolean, interval: any } } = {};
  currentlyRunningTimer: number | null = null;

  questionRequest: QuestionRequest | null = null;
  reviewText: string = ''; // Variable to store the review text
  candidateId: number = 0;
  candidateName: string = 'Jobin P Joseph';
  showResultsModal: boolean = false;
  showConfirmationModal: boolean = false; // New property for confirmation modal
  totalAnswered:number=0;
  isLoading: boolean = false;
  roles: RoleResult[] = [];


  technologyScores: { [key: number]: number } = {}; // Dictionary to store TechnologyId and scores
  overallPercentage: number = 83;
  tabs: string[] = ['Angular', 'Back End', 'Database/SQL'];
  activeTab: string = this.tabs[0];  // Set default active tab

  constructor(private questionService: QuestionService, private router: Router,   private snackBar: MatSnackBar) {}
  hasUnsavedChanges: boolean = true; // Set to true if the user makes changes
  isSubmitting: boolean = false; // Track submission state

  // This method will be called when navigating away from the page
  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('Unsaved changes will be discarded, and incomplete sections (questions & interview) will not be retained. Exit without saving?');
    }
    return true;
  }
ngOnInit(){
  this.questionRequest = history.state.QuestionRequest;
  if (!this.questionRequest) {
    console.error('No QuestionRequest data found.');
    this.showSnackbar('Error: No question data found', 'error');
  }
  console.log("Questions", this.questionRequest);
  this.loadQuestions();

}
loadQuestions() {
  this.isLoading = true;
    if (!this.questionRequest || !this.questionRequest.candidateId || !this.questionRequest.technologies) {
      console.error('Invalid Question Request. Cannot load questions.');
      this.showSnackbar('Error: Invalid question request', 'error');
      this.isLoading = false;
      return;
    }
  this.candidateId = this.questionRequest.candidateId;
  this.candidateName=this.questionRequest.candidateName;
  const technologies = this.questionRequest.technologies;


  this.questionService.getQuestions(this.candidateName,this.candidateId, technologies).subscribe({
    next: (data) => {
      this.roles = data;
 console.log(this.roles);

      this.tabs = this.roles.map(role => role.name);
      this.roles.forEach(role => {
        if (role.technologyId !== undefined) { // Check that the technologyId is defined
          this.technologyScores[role.technologyId] = 0; // Initialize score to 0 for each TechnologyId
        }      });
        this.activeTab = this.tabs[0];  // Set default active tab

      console.log('Technology Scores Initialized:', this.technologyScores);
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error fetching questions:', error);
      this.isLoading = false;
    },
});
}

  ngOnDestroy() {
    Object.values(this.timers).forEach(timer => {
      if (timer.interval) {
        clearInterval(timer.interval);
      }
    });
  }
  get filteredQuestions(): Question[] {
    const activeRole = this.roles.find(role => role.name === this.activeTab);
    return activeRole ? activeRole.questions : [];
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleTimer(questionId: number) {
    if (this.currentlyRunningTimer && this.currentlyRunningTimer !== questionId) {
      // Stop the currently running timer if it's different from the one being toggled
      this.stopTimer(this.currentlyRunningTimer);
    }
    if (!this.timers[questionId]) {
      this.timers[questionId] = { seconds: 0, isRunning: false, interval: null };
    }
    const timer = this.timers[questionId];

    if (timer.isRunning) {
      this.stopTimer(questionId);
    } else {
      this.startTimer(questionId);
    }
    // const timer = this.timers[questionId] || { seconds: 0, isRunning: false, interval: null };
    // if (timer.isRunning) {
    //   this.stopTimer(questionId);
    // } else {
    //   this.startTimer(questionId);
    // }
    // if (timer.isRunning) {
    //   clearInterval(timer.interval);
    //   timer.isRunning = false;
    //   // You may want to update the timer state in your timers object
    // } else {
    //   timer.interval = setInterval(() => {
    //     timer.seconds++;
    //   }, 1000);
    //   timer.isRunning = true;
    // }

    // Update the timers object
    this.timers[questionId] = timer;
  }
  private startTimer(questionId: number) {
    const timer = this.timers[questionId];
    if (!timer) return;

    timer.interval = setInterval(() => {
      timer.seconds++;
    }, 1000);
    timer.isRunning = true;
    this.currentlyRunningTimer = questionId;
  }

  private stopTimer(questionId: number) {
    const timer = this.timers[questionId];
    if (!timer) return;

    if (timer.interval) {
      clearInterval(timer.interval);
    }
    timer.isRunning = false;
    if (this.currentlyRunningTimer === questionId) {
      this.currentlyRunningTimer = null;
    }
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
    this.totalAnswered = 0; // Total of right and wrong answers

    this.roles.forEach(role => {
      const details = {
        right: 0,
        wrong: 0,
      };

      role.questions.forEach(question => {
        switch (question.answer) {
          case 'correct':
            details.right++;
            totalRight++; // Increment the global correct count
            this.totalAnswered++; // Increment the global answered count
            break;
          case 'incorrect':
            details.wrong++;
            this.totalAnswered++;
            break;
        }
      });

      const roleAnswered = details.right + details.wrong;
      role.details = details;
      role.percentage = roleAnswered > 0 ? Math.round((details.right / roleAnswered) * 100) : 0;
      if (this.technologyScores[role.technologyId] !== undefined) {
        this.technologyScores[role.technologyId] = role.percentage; // Set score for this technology
      }
      console.log(`Technology ${role.technologyId} Score: ${role.percentage}`);
    });

    this.overallPercentage = this.totalAnswered > 0 ? Math.round((totalRight / this.totalAnswered) * 100) : 0;
    console.log('Updated Technology Scores:', this.technologyScores);

  }
  SubmitResults() {
    const overallScore = this.overallPercentage;
    const review = this.reviewText;
    this.isSubmitting = true; // Set to true when submitting

    this.questionService.updateCandidateScore(this.candidateId, overallScore, review).subscribe({
      next: (response: string) => {
        console.log('Candidate overall score and review updated successfully', response);
        this.showSnackbar('Overall score and review updated successfully', 'success');
        this.router.navigate(['/interview-helper/interview-summary']);
      },
      error: (error) => {
        console.error('Error updating candidate overall score and review:', error);
        this.showSnackbar('Error updating overall score and review', 'error');
      }
    });

    const technologyScores = this.technologyScores;

    this.questionService.updateTechnologyScores(this.candidateId, technologyScores).subscribe({
      next: (response: string) => {
        console.log('Candidate technology scores updated successfully', response);
        this.showSnackbar('Technology scores updated successfully', 'success');
      },
      error: (error) => {
        console.error('Error updating candidate technology scores:', error);
        this.showSnackbar('Error updating technology scores', 'error');
      }
    });
  }
  finishInterview() {
    this.showConfirmationModal = true;

  }
  confirmFinish() {
    this.showConfirmationModal = false;
    this.calculateResults();
    if (this.totalAnswered===0){
      this.showConfirmationModal=false;
      this.router.navigate(['/interview-helper/candidate-form']).then(() => {
        this.router.navigate([this.router.url]); // Return to the current page after guard logic runs
      });
    }
    else{
      this.showResultsModal = true;
    }
  }


  // downloadResults() {
  //   // Implement download logic here
  //   console.log('Downloading results...');
  // }

  setRoleExpanded(role: any, expanded: boolean) {
    role.expanded = expanded;  // Set the expanded state manually based on the event
  }
  cancelFinish() {
    this.showConfirmationModal = false;
  }

  closeModal() {
    this.showResultsModal = false;
    this.showConfirmationModal = false;
  }

  logChange(questionText: string, answer: 'correct' | 'incorrect' | 'skip') {
    console.log(`Question "${questionText}" answered as "${answer}".`);
  }

  private showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
  

}
