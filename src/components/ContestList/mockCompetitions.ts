import contestImg1 from "../../assets/Contest_Images/wmug5dukcys 1-1.png";

export interface Competition {
  id: number;
  title: string;
  subtitle?: string;
  type: string;
  event: string;
  status: "Upcoming" | "Ongoing" | "Ended";
  participants: number;
  entry: string;
  ends: string; 
  logo: string;
  sponsorUrl?: string;
  sponsorText?: string;
}

export const competitionsData: Competition[] = [
  {
    id: 1,
    title: "Q2 Special The Major's Mix II",
    subtitle: "IC Trading Contest",
    type: "Traders Cup",
    event: "Event 7 of 16",
    status: "Upcoming",
    participants: 1391,
    entry: "Free",
    ends: "2025-09-02T00:00:00Z",
    logo: contestImg1,
    sponsorUrl: "https://sponsor1.com",
    sponsorText: "Top Broker",
  },
  {
    id: 2,
    title: "Star, Strips & Pips: The zForex Showdown",
    subtitle: "Weekly Challenge",
    type: "Weekly",
    event: "",
    status: "Ongoing",
    participants: 2514,
    entry: "Free",
    ends: "2025-07-15T00:00:00Z",
    logo: contestImg1,
    sponsorUrl: "https://sponsor2.com",
    sponsorText: "Finance Partner",
  },
  {
    id: 3,
    title: "The Index Ninjas I",
    subtitle: "Event Challenge",
    type: "Traders Cup",
    event: "Event 6 of 16",
    status: "Ended",
    participants: 3120,
    entry: "Free",
    ends: "2025-07-11T13:00:00Z",
    logo: contestImg1,
    sponsorUrl: "https://sponsor3.com",
    sponsorText: "Global FX",
  },
  {
    id: 4,
    title: "Crypto Challenge Week 1",
    subtitle: "Crypto Contest",
    type: "Weekly",
    event: "",
    status: "Ended",
    participants: 1820,
    entry: "Free",
    ends: "2025-07-11T13:00:00Z",
    logo: contestImg1,
  },
  {
    id: 5,
    title: "Crypto Challenge Week 2",
    subtitle: "Crypto Contest",
    type: "Weekly",
    event: "",
    status: "Ended",
    participants: 1750,
    entry: "Free",
    ends: "2025-07-18T13:00:00Z",
    logo: contestImg1,
  },
  {
    id: 6,
    title: "Crypto Challenge Week 3",
    subtitle: "Crypto Contest",
    type: "Weekly",
    event: "",
    status: "Ended",
    participants: 1902,
    entry: "Free",
    ends: "2025-07-25T13:00:00Z",
    logo: contestImg1,
  },
];
