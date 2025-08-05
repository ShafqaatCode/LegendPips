import { competitionsData, type Competition } from "./mockCompetitions";

export const fetchCompetitions = (): Promise<Competition[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(competitionsData); 
    }, 500);
  });
};


export const fetchCompetitionById = (id: number): Promise<Competition | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const competition = competitionsData.find((comp) => comp.id === id);
      resolve(competition ?? null);
    }, 500);
  });
}
