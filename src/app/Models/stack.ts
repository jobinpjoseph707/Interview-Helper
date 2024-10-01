import { ExperienceLevel } from "./experience-level";

export interface Stack {
  technologyId: number;          // Unique ID for the technology
  technology: string;            // Name of the technology (e.g., Angular, .NET)
  experienceLevels: ExperienceLevel[];  // Array of experience levels with IDs
}
