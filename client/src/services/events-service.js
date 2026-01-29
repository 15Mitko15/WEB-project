// src/services/events-service.js
import { http } from "./http-service.js";

const ENDPOINTS = {
  list: "events",
  interests: "interests",
  setInterest: "events/interest",
};

export class EventsService {
  async list() {
    const { result } = await http.get(ENDPOINTS.list);
    return result?.events ?? result;
  }

  async listInterests() {
    const { result } = await http.get("interests");
    return result?.interests ?? [];
  }

  async setInterest(eventId, interestId) {
    console.log("callings");
    console.log("mitkooo", eventId, interestId);
    return await http.post(ENDPOINTS.setInterest, {
      body: { event_id: eventId, interest_id: interestId },
    });
  }
}

export const eventsService = new EventsService();
