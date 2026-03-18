// This file is kept for backward compatibility
// The actual API calls are now in src/services/contestService.ts
import { fetchCompetitions as fetchCompetitionsAPI, fetchCompetitionById as fetchCompetitionByIdAPI, type Competition } from "../../services/contestService";

// Re-export the API functions for backward compatibility
export const fetchCompetitions = fetchCompetitionsAPI;
export const fetchCompetitionById = fetchCompetitionByIdAPI;
export type { Competition };
