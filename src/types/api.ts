export interface ApiResponse<T> {
  data: T;
}

export type AgeRatingCode = "G" | "PG" | "12+" | "16+" | "18+";
export type MovieKind = "film" | "event";
export type TimeBand = "morning" | "afternoon" | "evening";
export type SessionSort =
  | "time_asc"
  | "time_desc"
  | "price_asc"
  | "price_desc"
  | "title_asc";
export type TicketTypeSlug = "adult" | "child" | "student";
export type SeatState = "available" | "sold" | "held" | "unavailable";
export type OrderStatus = "paid" | "refunded";

export interface Format {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;
}

export interface Language {
  id: number;
  slug: string;
  name: string;
}

export interface Genre {
  id: number;
  slug: string;
  name: string;
}

export interface Venue {
  id: number;
  slug: string;
  name: string;
  city: string;
  formats: Format[];
}

export interface Hall {
  id: number;
  name: string;
}

export interface AgeRating {
  code: AgeRatingCode;
  minAge: number;
  description: string;
}

export interface TicketType {
  id: number;
  slug: TicketTypeSlug;
  name: string;
  priceRatio: number;
  note: string | null;
  blockedFromRatingAge: number | null;
}

export interface TimeBandOption {
  id: TimeBand;
  label: string;
}

export interface SortOption {
  id: SessionSort;
  label: string;
}

export interface FilterOptions {
  venues: Venue[];
  formats: Format[];
  languages: Language[];
  timeBands: TimeBandOption[];
  sorts: SortOption[];
  ticketTypes: TicketType[];
  ageRatings: AgeRating[];
  maxSeatsPerOrder: number;
  holdMinutes: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  fullName: string | null;
  mobileNumber: string | null;
  dateOfBirth: string | null;
  age: number | null;
  preferredVenue: Venue | null;
  profileComplete: boolean;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface Movie {
  id: number;
  slug: string;
  title: string;
  kind: MovieKind;
  runtimeMinutes: number;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  isComingSoon: boolean;
  isNotified: boolean;
  isFeatured: boolean;
  fromPrice: number;
  synopsis: string;
  ageRating: AgeRating;
  genres: Genre[];
  formats: Format[];
}

export interface MovieDetail extends Movie {
  director: string | null;
  cast: string | null;
  availableDates: string[];
}

export interface Session {
  id: number;
  startsAt: string;
  date: string;
  time: string;
  timeBand: TimeBand;
  price: number;
  seatsLeft: number;
  isSoldOut: boolean;
  hall: Hall;
  venue: Venue;
  format: Format;
  language: Language;
}

export interface SessionWithMovie extends Session {
  movie: Movie;
}

export interface VenueSessions {
  venue: Venue;
  sessions: Session[];
}

export interface SessionGroup {
  movie: Movie;
  sessions: Session[];
}

export interface SessionsMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalSessions: number;
  totalMovies: number;
  date: string;
}

export interface SessionsPage {
  data: SessionGroup[];
  meta: SessionsMeta;
}

export interface Seat {
  id: number;
  code: string;
  label: string;
  state: SeatState;
  aisleAfter: boolean;
  isMine: boolean;
}

export interface SeatRow {
  label: string;
  seats: Seat[];
}

export interface SeatSection {
  name: string;
  rows: SeatRow[];
}

export interface SeatMap {
  sessionId: number;
  hall: Hall & { venue: Venue };
  sections: SeatSection[];
}

export interface HeldSeat {
  seatId: number;
  code: string;
  ticketType: { slug: TicketTypeSlug; name: string };
  price: number;
}

export interface SeatHold {
  holdId: string;
  sessionId: number;
  expiresAt: string;
  secondsRemaining: number;
  isLive: boolean;
  subtotal: number;
  seats: HeldSeat[];
}

export interface OrderTicket {
  id: number;
  seatCode: string;
  ticketType: { slug: TicketTypeSlug; name: string };
  price: number;
}

export interface Order {
  id: number;
  reference: string;
  status: OrderStatus;
  totalPrice: number;
  paidAt: string;
  refundedAt: string | null;
  isUpcoming: boolean;
  isRefundable: boolean;
  cardLastFour: string;
  contact: {
    fullName: string;
    email: string;
    mobileNumber: string;
  };
  session: SessionWithMovie;
  tickets: OrderTicket[];
}
