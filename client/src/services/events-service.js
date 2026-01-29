import { http } from "./http-service.js";

const ENDPOINTS = {
  registerEvent: "register_event",
  slotDates: "slot_dates",
  slotHalls: "slot_halls",
  slots: "slots",
  eventsBySlot: "events_by_slot",
  list: "events",
  interests: "interests",
  setInterest: "events/interest",
  faculties: "faculties",
  halls: "halls",
};

export class EventsService {
  async list() {
    const { result } = await http.get(ENDPOINTS.list);
    return result?.events ?? result ?? [];
  }

  async listInterests() {
    const { result } = await http.get(ENDPOINTS.interests);
    return result?.interests ?? [];
  }

  async setInterest(eventId, interestId) {
    return await http.post(ENDPOINTS.setInterest, {
      body: { event_id: eventId, interest_id: interestId },
    });
  }

  async registerEvent({ date, time, hall_id, title, description }) {
    return await http.post(ENDPOINTS.registerEvent, {
      body: { date, time, hall_id, title, description },
    });
  }

  async listFaculties() {
    const { result } = await http.get(ENDPOINTS.faculties);
    return result?.faculties ?? [];
  }

  async listHallsByFaculty(facultyId) {
    const { result } = await http.get(
      `${ENDPOINTS.halls}?faculty_id=${encodeURIComponent(String(facultyId))}`
    );
    return result?.halls ?? [];
  }

  async listSlotDates() {
    const { result } = await http.get(ENDPOINTS.slotDates);
    return result?.dates ?? [];
  }

  async listSlotHallsByDate(date) {
    const { result } = await http.get(
      `${ENDPOINTS.slotHalls}?date=${encodeURIComponent(date)}`
    );
    return result?.halls ?? [];
  }

  async listSlotsByDateAndHall(date, hallId) {
    const { result } = await http.get(
      `${ENDPOINTS.slots}?date=${encodeURIComponent(
        date
      )}&hall_id=${encodeURIComponent(String(hallId))}`
    );
    return result?.slots ?? [];
  }

  async listEventsForSlot(slotId) {
    const { result } = await http.get(
      `${ENDPOINTS.eventsBySlot}?slot_id=${encodeURIComponent(String(slotId))}`
    );
    return result?.events ?? [];
  }
  async getEvent(id) {
    const { result } = await http.get(
      `event?id=${encodeURIComponent(String(id))}`
    );
    return result?.event;
  }

  async getEventAttendees(eventId) {
    const { result } = await http.get(
      `event_attendees?event_id=${encodeURIComponent(String(eventId))}`
    );
    return result?.groups ?? {};
  }

  async getEventComments(eventId) {
    const { result } = await http.get(
      `event_comments?event_id=${encodeURIComponent(String(eventId))}`
    );
    return result?.comments ?? [];
  }

  async addComment({ event_id, body, parent_id = null }) {
    const { result } = await http.post("event_comments", {
      body: { event_id, body, parent_id },
    });
    return result?.comment;
  }
}

export const eventsService = new EventsService();
