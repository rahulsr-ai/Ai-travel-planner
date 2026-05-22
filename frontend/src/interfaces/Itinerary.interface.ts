
 interface LocationDetail {
  placeName: string;
  bestTimeToVisit: string;
  timing: string;
  howToReach: string;
  isFamilyFriendly: boolean;
  aiRecommendationReason: string;
  shortDescription: string;
}

 interface DayPlan {
  dayNumber: number;
  theme: string;
  locations: LocationDetail[];
}

export interface ItineraryData {
  passengerName: string;
  destination: string;
  startDate: string;
  durationDays: number;
  plan: {
    tripTitle: string;
    days: DayPlan[];
  };
}