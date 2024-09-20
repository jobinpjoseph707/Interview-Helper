import { Component } from '@angular/core';
import questionsData from '../../data/questionsdata.json'
import { NgFor } from '@angular/common';
// type AnswerType = 'correct' | 'incorrect' | 'skip' | null;

// interface Question {
//   id: number;
//   text: string;
//   answer: AnswerType;
// }

// type AnswerType = 'correct' | 'incorrect' | 'skip' | null;  

interface Question {  
  id: number;  
  text: string;  
  answer: string;  
}  

interface QuestionCategory {  
  category: string;  
  questions: Question[];  
}  
@Component({
  selector: 'app-questionpage',
  standalone: true,
  imports: [NgFor],
  templateUrl: './questionpage.component.html',
  styleUrl: './questionpage.component.scss'
})
export class QuestionpageComponent {
  minutes: number = 0;
  seconds: number = 0;
  isTimerRunning: boolean = false;
  timerInterval: any;

  ngOnDestroy() {
    this.stopTimer();
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
  tabs = ['Front end', 'Back end', 'Database/sql'];  
  activeTab = 'Front end';  
  questions: QuestionCategory[] = [
    {
      category: "Front end",
      questions: [
        {
          id: 101,
          text: "What is the purpose of the DOM (Document Object Model)?",
          answer: "null"
        },
        {
          id: 102,
          text: "Explain the difference between var, let, and const in JavaScript.",
          answer: "null"
        }
      ]
    },
    {
      category: "Back end",
      questions: [
        {
          id: 201,
          text: "What is the purpose of a web server?",
          answer: "null"
        },
        {
          id: 202,
          text: "Explain the difference between SQL and NoSQL databases.",
          answer: "null"
        }
      ]
    },
    {
      category: "Database/sql",
      questions: [
        {
          id: 301,
          text: "What is the purpose of a primary key in a database table?",
          answer: "null"
        },
        {
          id: 202,
          text: "Explain the difference between a JOIN and a UNION in SQL.",
          answer: "null"
        }
      ]
    }
  ];
  filteredQuestions: Question[] = [];

  setActiveTab(tab: string) {  
    this.activeTab = tab;  
    this.filterQuestions(); // Update filtered questions when tab changes

  }  
  filterQuestions() {
    // Filter questions based on the active tab/category
    const selectedCategory = this.questions.find(category => category.category === this.activeTab);
    this.filteredQuestions = selectedCategory ? selectedCategory.questions : [];
  }

  answerQuestion(questionId: number, answer: 'correct' | 'incorrect' | 'skip') {
    const question = this.filteredQuestions.find(q => q.id === questionId);
    if (question) {
      question.answer = answer;
      this.logChange(question.text, answer); // Log answer change
    }
  }


  finishInterview() {  
    console.log('Interview finished');  
  }  


  logChange(questionText: string, answer: 'correct' | 'incorrect' | 'skip') {  
    console.log(`Question "${questionText}" answered as "${answer}".`);  
  }  
  constructor() {
    this.filterQuestions();  // Initialize the filtered questions on load
  }
 
}
