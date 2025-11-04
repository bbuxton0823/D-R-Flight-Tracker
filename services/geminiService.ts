import { GoogleGenAI } from "@google/genai";
import type { TripData, Source, TripLeg, ShutdownAlertData } from "../types";

const getPromptForLeg = (legIndex: number): string => {
  const commonInstructions = `
      You are an AI assistant that provides real-time flight, airport, and weather data exclusively in a single, valid JSON object format.
      Your primary goal is to fetch the absolute latest, most up-to-the-minute gate and flight status information. Prioritize data from official airline websites (American, United) and airport authority sources (e.g., flysfo.com, fly2houston.com, miami-airport.com) to ensure the highest accuracy and reliability.
      Your entire response must be only the JSON object, without any markdown formatting, comments, or other text.
      For the 'aircraft' field, always provide the specific aircraft model name and variant if available (e.g., "Boeing 737-800", "Airbus A321neo"). Avoid generic terms like "Jet".
      
      Each airport object must include: name, code, an array of departures, and a securityWaitTimes object.
      Each securityWaitTimes object must have 'standard', 'tsaPreCheck', and 'clear' properties, with each value being a single string (e.g., "10-15 min").
      Each flight must include: flightNumber, destination, status ('On Time', 'Delayed', 'Cancelled', 'Diverted', 'Landed'), optional delayMinutes, time including local timezone (PST, CST, EST), airline, aircraft, gate, and optional baggageClaim.
  `;

  const shutdownAlertPrompt = `
    Also include a top-level 'shutdownAlert' object with a 'level' ('None', 'Warning', 'Severe') and a 'message' regarding potential U.S. government shutdowns affecting travel.
  `;

  const legPrompts = [
    // Leg 0: Flights to Miami
    `Generate a JSON object for the first leg of a trip: "Flights to Miami". The object should contain a 'tripLeg' key.
     - title: "Flights to Miami"
     - date: "Nov 6th & 7th"
     - airports: An array containing data for SFO and IAH.
     - SFO departures should be for November 6th to MIA. You MUST include United Airlines flight UA1769 departing at 11:05 PM PST.
     - IAH departures should be for November 7th to MIA. You MUST only include American Airlines flight AA2144 departing at 5:30 AM CST.
    `,
    // Leg 1: Flight to P. Plata
    `Generate a JSON object for the second leg of a trip: "Flight to P. Plata". The object should contain a 'tripLeg' key.
     - title: "Flight to P. Plata"
     - date: "Nov 7th"
     - airports: An array with one object for MIA.
     - The departure MUST be American Airlines flight AA2691 to POP (Puerto Plata) at 10:25 AM EST.
     - This leg MUST include a 'weatherForecast' array for Puerto Plata, Dominican Republic, with a 5-day forecast starting from November 7th.
     - Each weatherForecast object must include: date (e.g., 'Nov 7'), dayOfWeek (e.g., 'Thu'), condition ('Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm'), a concise 'description', an optional 'rainChance' percentage number, highTemp (Fahrenheit), and lowTemp (Fahrenheit).
    `,
    // Leg 2: Flight from P. Plata
    `Generate a JSON object for the third leg of a trip: "Flight from P. Plata". The object should contain a 'tripLeg' key.
     - title: "Flight from P. Plata"
     - date: "Nov 11th"
     - airports: An array with one object for POP.
     - The departure MUST be American Airlines flight AA2691 returning to MIA.
     - This leg MUST include a 'weatherForecast' array for Puerto Plata, Dominican Republic, with a single forecast object for November 11th ONLY.
     - The weatherForecast object must include: date (e.g., 'Nov 11'), dayOfWeek (e.g., 'Mon'), condition ('Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm'), a concise 'description', an optional 'rainChance' percentage number, highTemp (Fahrenheit), and lowTemp (Fahrenheit).
    `,
    // Leg 3: Flights Home
    `Generate a JSON object for the fourth leg of a trip: "Flights Home". The object should contain a 'tripLeg' key.
     - title: "Flights Home"
     - date: "Nov 11th"
     - airports: An array with one object for MIA.
     - The departures must include flights to SFO and IAH.
     - For SFO, you MUST include American Airlines flight AA1684 and other relevant United Airlines flights.
    `
  ];

  const structurePrompt = `
    The structure must match this interface:
    interface Response {
      tripLeg: {
        title: string;
        date: string;
        airports: { ... }[];
        weatherForecast?: { ... }[];
      };
      shutdownAlert?: { ... };
    }
  `;

  return `${commonInstructions}\n${legPrompts[legIndex]}\n${legIndex === 0 ? shutdownAlertPrompt : ''}\n${structurePrompt}`;
};


export async function fetchTripLegData(legIndex: number): Promise<{ leg: TripLeg; sources: Source[]; shutdownAlert?: ShutdownAlertData }> {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = getPromptForLeg(legIndex);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})|(\[[\s\S]*\])/);

    if (!jsonMatch) {
      console.error("Gemini response did not contain valid JSON:", text);
      throw new Error("Failed to find a valid JSON object in the response.");
    }
    
    const jsonString = jsonMatch[1] || jsonMatch[2] || jsonMatch[3];
    const parsedJson = JSON.parse(jsonString);

    const leg: TripLeg = parsedJson.tripLeg;
    const shutdownAlert: ShutdownAlertData | undefined = parsedJson.shutdownAlert;

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
    
    return { leg, sources, shutdownAlert };

  } catch (error) {
    console.error(`Error fetching trip data for leg ${legIndex} from Gemini API:`, error);
    throw error;
  }
}