export interface Question {  
    id: number;  
    text: string;  
    role: string;
    answer:  'correct' | 'incorrect' | null;  
  }  
  export interface RoleResult {
    name: string;
    technologyId:number;
    questions: Question[];
    details?: {
      right: number;
      wrong: number;
    };
    percentage?: number;
  } 

  export interface TechnologyExperience {
    technologyId: number;      // The ID of the technology
    experienceLevelId: number;  // The ID of the experience level
}

export interface QuestionRequest {
  candidateName:string;
    candidateId: number;              // The ID of the candidate
    technologies: TechnologyExperience[]; // List of technologies and their experience levels
}