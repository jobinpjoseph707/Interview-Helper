export interface Question {  
    id: number;  
    text: string;  
    role: string;
    answer:  'correct' | 'incorrect' | 'skip' | null;  
  }  
  export interface RoleResult {
    name: string;
    questions: Question[];
    details?: {
      right: number;
      wrong: number;
      skipped: number;
    };
    percentage?: number;
  } 