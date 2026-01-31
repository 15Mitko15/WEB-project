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

  async listSlotDates({ includePast = false } = {}) {
    const q = includePast ? "?include_past=1" : "";
    const { result } = await http.get(`${ENDPOINTS.slotDates}${q}`);
    return result?.dates ?? [];
  }

  async listSlotHallsByDate(date, { includePast = false } = {}) {
    const q = new URLSearchParams({
      date: String(date),
      ...(includePast ? { include_past: "1" } : {}),
    }).toString();

    const { result } = await http.get(`${ENDPOINTS.slotHalls}?${q}`);
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

  async listSlotsAll({ include_past = 0 } = {}) {
    const { result } = await http.get(
      `${ENDPOINTS.slots}?include_past=${encodeURIComponent(
        String(include_past)
      )}`
    );
    return result?.slots ?? [];
  }

  async updateEvent(id, patch) {
    const { result } = await http.put(
      `event?id=${encodeURIComponent(String(id))}`,
      {
        body: patch,
      }
    );
    return result?.event ?? result;
  }

  async updateEvent(id, patch) {
    // patch can contain: { title, description/event_description, hall_id, date, time, event_datetime }
    if (typeof http.put !== "function") {
      throw new Error("http.put() is not available in http-service.js");
    }

    const { result } = await http.put(
      `event?id=${encodeURIComponent(String(id))}`,
      {
        body: patch,
      }
    );

    return result?.event ?? result;
  }
}

export const eventsService = new EventsService();
