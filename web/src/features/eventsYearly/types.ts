export type RawEvent = {
  id: string;
  created: number;
  description: string;
  link: string;
  name: string;
  local_date: string;
  local_time: string;
  yes_rsvp_count: number;
  venue: {
    address_1: string;
    city: string;
    country: string;
    id: string;
  };
};
