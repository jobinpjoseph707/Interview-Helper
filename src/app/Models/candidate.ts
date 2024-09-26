import { Stack } from "./stack";

export interface Candidate {
  name: string;
  role: string;
  interviewDate: string;
  stacks: Stack[]; 
}
