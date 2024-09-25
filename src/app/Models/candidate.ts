import { Stack } from "./stack";

export interface Candidate {
  name: string;
  role: string;
  interviewDate: string;
  stacks: Stack[]; // An array of stack-experience pairs
}
