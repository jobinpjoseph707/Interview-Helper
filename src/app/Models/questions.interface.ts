export interface Question {  
    id: number;  
    text: string;  
    role: string;
    answer:  'correct' | 'incorrect' | null;  
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

  export interface TechnologyExperience {
    technologyId: number;      // The ID of the technology
    experienceLevelId: number;  // The ID of the experience level
}

export interface QuestionRequest {
    candidateId: number;              // The ID of the candidate
    technologies: TechnologyExperience[]; // List of technologies and their experience levels
}