// events-service.js
import { http } from "./http-service.js";

const ENDPOINTS = {
  slots: "slots",
};

export class SlotService {
  async createSlot({
    slot_date,
    date,
    hall_id,
    start_time,
    end_time,
    duration_minutes,
  }) {
    const payload = {
      // your backend accepts slot_date (and you sometimes pass date)
      slot_date: slot_date ?? date,
      hall_id: Number(hall_id),
      start_time,
      end_time,
      duration_minutes: Number(duration_minutes),
    };

    const { result } = await http.post(ENDPOINTS.slots, { body: payload });

    // backend suggested response shape: { ok:true, slot:{...} }
    // but we’ll support either returning the created object directly.
    return result?.slot ?? result;
  }

  // ...
}

export const slotService = new SlotService();
