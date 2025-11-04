import { GoogleGenAI } from "@google/genai";
import type { TripData, Source } from "../types";

export async function fetchTripData(): Promise<{ data: TripData | null; sources: Source[] }> {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are an AI assistant that provides real-time flight, airport, and weather data exclusively in a single, valid JSON object format.
      Your primary goal is to fetch the absolute latest, most up-to-the-minute gate and flight status information. Prioritize data from official airline websites (American, United) and airport authority sources (e.g., flysfo.com, fly2houston.com, miami-airport.com) to ensure the highest accuracy and reliability.
      Your entire response must be only the JSON object, without any markdown formatting, comments, or other text.
      
      Generate a JSON object for a group trip with a four-leg itinerary.
      
      - Leg 1: "Flights to Miami"
        - date: "Nov 6th & 7th"
        - airports: An array containing data for SFO and IAH.
        - SFO departures should be for November 6th to MIA. You MUST include United Airlines flight UA1769 departing at 11:05 PM PST.
        - IAH departures should be for November 7th to MIA. You MUST only include American Airlines flight AA2144 departing at 5:30 AM CST.
        
      - Leg 2: "Flight to P. Plata"
        - date: "Nov 7th"
        - airports: An array with one object for MIA.
        - The departure MUST be American Airlines flight AA2691 to POP (Puerto Plata) at 10:25 AM EST.
        - This leg MUST include a 'weatherForecast' array for Puerto Plata, Dominican Republic, covering November 7th through November 11th.

      - Leg 3: "Flight from P. Plata"
        - date: "Nov 11th"
        - airports: An array with one object for POP.
        - The departure MUST be American Airlines flight AA2691 returning to MIA.
        - This leg MUST include a 'weatherForecast' array for Puerto Plata, Dominican Republic, covering November 7th through November 11th.

      - Leg 4: "Flights Home"
        - date: "Nov 11th"
        - airports: An array with one object for MIA.
        - The departures must include flights to SFO and IAH.
        - For SFO, you MUST include American Airlines flight AA1684 and other relevant United Airlines flights.
        
      Each airport object must include: name, code, an array of departures, and a securityWaitTimes object.
      Each securityWaitTimes object must have 'standard', 'tsaPreCheck', and 'clear' properties, with each value being a single string (e.g., "10-15 min"). Do not return nested objects for these values.
      Each flight must include: flightNumber, destination, status ('On Time', 'Delayed', 'Cancelled', 'Diverted', 'Landed'), optional delayMinutes, time including local timezone (PST, CST, EST), airline, aircraft, gate, and optional baggageClaim.
      Each weatherForecast object must include: date (e.g., 'Nov 7'), dayOfWeek (e.g., 'Thu'), condition ('Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm'), a concise 'description', an optional 'rainChance' percentage number, highTemp (Fahrenheit), and lowTemp (Fahrenheit). For the 'description', if there is a chance of rain or thunderstorms, specify the timing (e.g., "AM Showers", "PM T-Storms", "Rain in the Eve.").
      
      Also include a top-level 'shutdownAlert' object with a 'level' ('None', 'Warning', 'Severe') and a 'message' regarding potential U.S. government shutdowns affecting travel.

      The structure must match this TripData interface:
      interface TripData {
          tripLegs: {
              title: string;
              date: string;
              airports: {
                  name: string;
                  code: string;
                  departures: { ... }[];
                  securityWaitTimes: { standard: string; tsaPreCheck: string; clear: string; };
              }[];
              weatherForecast?: {
                  date: string;
                  dayOfWeek: string;
                  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Rain' | 'Thunderstorm';
                  description: string;
                  rainChance?: number;
                  highTemp: number;
                  lowTemp: number;
              }[];
          }[];
          shutdownAlert: { ... };
      }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text.trim();
    if (text.startsWith('```json')) {
      text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith('`')) {
      text = text.substring(1, text.length - 1).trim();
    }

    const data: TripData = JSON.parse(text);

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: Source[] = [];
    if (groundingMetadata?.groundingChunks) {
        for (const chunk of groundingMetadata.groundingChunks) {
            if (chunk.web) {
                sources.push({
                    uri: chunk.web.uri,
                    title: chunk.web.title,
                });
            }
        }
    }
    
    return { data, sources };

  } catch (error) {
    console.error("Error fetching trip data from Gemini API:", error);
    throw error;
  }
}