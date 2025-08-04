import { competitionsData, type Competition } from "./mockCompetitions";

export const fetchCompetitions = (): Promise<Competition[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(competitionsData); // Simulating API delay
    }, 800);
  });
};
