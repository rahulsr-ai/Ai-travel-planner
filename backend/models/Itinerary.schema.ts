import { Schema, model, Document, Types } from 'mongoose';

export interface IItinerary extends Document {
  user: Types.ObjectId;
  passengerName: string 
  destination: string;
  startDate: string;
  durationDays: number;
  plan: any; // Gemini se jo structured JSON milega, wo poora yahan store hoga
  isShared: boolean;
}


const itinerarySchema = new Schema<IItinerary>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  passengerName: { type: String, default: 'Valued Traveler' }, // ⚡ NEW FIELD FOR PASSENGER NAME
  destination: { type: String, required: true, default: 'Unknown Destination' },
  startDate: { type: String, default: 'Not Specified' },
  durationDays: { type: Number, default: 3 },
  plan: {
    tripTitle: { type: String },
    days: [{
      dayNumber: { type: Number },
      theme: { type: String },
      locations: [{
        placeName: { type: String },
        bestTimeToVisit: { type: String },
        timing: { type: String },
        howToReach: { type: String },
        isFamilyFriendly: { type: Boolean },
        aiRecommendationReason: { type: String },
        shortDescription: { type: String }
      }]
    }]
  },
  isShared: { type: Boolean, default: true }
}, { timestamps: true });



export const Itinerary = model<IItinerary>('Itinerary', itinerarySchema);