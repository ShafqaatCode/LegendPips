export interface Competition {
  id: number;
  title: string;
  type: string;
  event: string;
  status: "Upcoming" | "Ongoing" | "Ended";
  participants: number;
  entry: string;
  ends: string;
  logo: string;
}

export const competitionsData: Competition[] = [
  {
    id: 1,
    title: "Q2 Special The Major's Mix II",
    type: "Traders Cup",
    event: "Event 7 of 16",
    status: "Upcoming",
    participants: 1391,
    entry: "Free",
    ends: "Aug 2, 2025, 12:00 AM",
    logo: "https://dummyimage.com/60x60/012d5c/fff.png&text=IC",
  },
  {
    id: 2,
    title: "Star, Strips & Pips: The zForex Showdown",
    type: "Weekly",
    event: "",
    status: "Ongoing",
    participants: 2514,
    entry: "Free",
    ends: "Jul 15, 2025, 12:00 AM",
    logo: "https://dummyimage.com/60x60/2ecc71/fff.png&text=FX",
  },
  {
    id: 3,
    title: "The Index Ninjas I",
    type: "Traders Cup",
    event: "Event 6 of 16",
    status: "Ended",
    participants: 3120,
    entry: "Free",
    ends: "Jul 11, 2025, 01:00 PM",
    logo: "https://dummyimage.com/60x60/f39c12/fff.png&text=TC",
  },
  {
    id: 4,
    title: "Crypto Challenge",
    type: "Weekly",
    event: "",
    status: "Ended",
    participants: 1820,
    entry: "Free",
    ends: "Jul 11, 2025, 01:00 PM",
    logo: "https://dummyimage.com/60x60/3498db/fff.png&text=CR",
  },
  {
    id: 5,
    title: "Crypto Challenge",
    type: "Weekly",
    event: "",
    status: "Ended",
    participants: 1820,
    entry: "Free",
    ends: "Jul 11, 2025, 01:00 PM",
    logo: "https://dummyimage.com/60x60/3498db/fff.png&text=CR",
  },
  {
    id: 6,
    title: "Crypto Challenge",
    type: "Weekly",
    event: "",
    status: "Ended",
    participants: 1820,
    entry: "Free",
    ends: "Jul 11, 2025, 01:00 PM",
    logo: "https://dummyimage.com/60x60/3498db/fff.png&text=CR",
  },
  {
    id: 4,
    title: "Crypto Challenge",
    type: "Weekly",
    event: "",
    status: "Ended",
    participants: 1820,
    entry: "Free",
    ends: "Jul 11, 2025, 01:00 PM",
    logo: "https://dummyimage.com/60x60/3498db/fff.png&text=CR",
  },
  {
    id: 4,
    title: "Crypto Challenge",
    type: "Weekly",
    event: "",
    status: "Ended",
    participants: 1820,
    entry: "Free",
    ends: "Jul 11, 2025, 01:00 PM",
    logo: "https://dummyimage.com/60x60/3498db/fff.png&text=CR",
  },
];
