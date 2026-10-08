# Kino XII

A cinema network booking app built for the Redberry Bootcamp XII selection stage. Browse what is on, filter showtimes across venues, pick seats on the real hall map, hold them for eight minutes, pay and manage your tickets.

- **Design:** implemented from the Kino XII Figma file (screens, components and prototype interactions), in dark and light themes.
- **API:** the provided REST API at `https://api.kinoxii.redberryinternship.ge/api`, with no mock backend.
- **Target:** designed against a 1728px frame and verified up to 1920×1080. Layouts are fluid down to phone width.

## Features

| Area | What it does |
| --- | --- |
| **Home** | Auto-advancing hero carousel (3s, pauses on hover, focus and hidden tabs), recently viewed films, Now Playing cards that expand on hover, Coming Soon cards with an auth-gated Notify Me. |
| **Search** | Debounced typeahead in the navbar with prompt, results and empty states, highlighted matches, keyboard navigation and `Esc` to close. |
| **Movie page** | Backdrop hero, details panel with rating note, a 7-day picker driven by `availableDates`, sessions grouped by venue and hall, age gate, coming-soon variant, not-found state. |
| **Sessions** | Sticky filter sidebar (venue, date, format, language, time of day), sort, 10 films per page. Every control lives in the URL. Selecting venues narrows the format list and drops formats those venues do not offer. |
| **Booking** | URL-driven modal (`?session=`): seat map drawn from the API, up to 3 seats with per-seat ticket types, 8-minute hold with a countdown, checkout with masked card fields, order confirmation. |
| **Profile** | Personal information form with the exact validation messages, eligibility notice, avatar upload, completion status. |
| **My Tickets** | Upcoming and past tabs with counts, refund confirmation, refund state driven by the API's `isRefundable`. |
| **Auth** | Login and register modals. Any `401` opens the login modal and replays the original request afterwards. |

## Stack

Next.js 16 (App Router, React Compiler), React 19, TypeScript, Tailwind CSS 4, TanStack Query 5, axios, nuqs, react-hook-form with zod 4, zustand, date-fns, Biome, Bun.

## Getting started

```bash
bun install
cp .env.example .env.local
bun dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://api.kinoxii.redberryinternship.ge/api` | Base URL of the Kino XII API |

### Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start the development server |
| `bun run build` | Create a production build |
| `bun start` | Serve the production build |
| `bun run lint` | Check code with Biome |
| `bun run format` | Format code with Biome |
| `bun test` | Run the unit tests |

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/movies/[slug]` | Movie details and sessions. `?date=` selects the day. |
| `/sessions` | Sessions list. `?venues=&formats=&languages=&bands=&date=&sort=&page=` |
| `/profile` | Profile. `?tab=tickets&filter=past` opens the ticket tabs. |
| any page + `?session=<id>` | Opens the booking modal for that session |

## Project structure

```text
src/
  app/                    Routes, layout, providers, not-found and error pages
  components/
    layout/               Navbar, footer, search box, profile menu, theme toggle
    ui/                   Design-system primitives (button, input, modal, tabs, ...)
  features/
    auth/                 Session store, login and register, 401 replay, age gate
    booking/              Seat map, hold lifecycle, checkout, confirmation
    movies/               Home sections, movie detail, recently viewed
    profile/              Profile form, tickets, refunds
    search/               Typeahead panel
    sessions/             Filters in the URL, session list
  lib/
    api/                  axios client, error normalisation, token storage
    forms/                Input masks and API error mapping
    hooks/                Debounce, drag scroll, single-flight mutations
  types/                  API types
```

Each feature owns its API calls, queries, components and pure helpers, so a page is a thin composition.

## Design decisions

- **URL as state.** Filters, sort, page, selected day, profile tab and the open booking session are all query parameters (nuqs). Reloads, deep links and back/forward work. Changing a filter or the sort resets the page to 1.
- **One axios client.** It attaches the token, normalises every failure into a typed `ApiError` (`unauthenticated`, `conflict`, `rule`, `validation`, ...) and, on a `401`, opens the login modal and replays the original request once the user signs in.
- **The server is the source of truth.** Refund availability comes from `isRefundable`, the order confirmation renders the response body, lists refetch after mutations, and prices on the seat map are previews until the hold response replaces them.
- **Hold lifecycle.** The countdown ticks against the absolute `expiresAt`, so background tabs do not drift. Going back from checkout reuses the existing hold. Closing the modal releases it. A reload restores a live hold from `sessionStorage`. A `409` marks the contested seats sold, keeps the rest of the selection and refetches the map. An expired hold resets the modal with a warning.
- **Seat map from data.** Sections, rows, row labels, gangways (`aisleAfter`) and empty spaces (`unavailable`) all come from the response. Seat size adapts to the widest row.
- **Duplicate submits are blocked synchronously.** Every mutating action goes through a single-flight guard, so double clicks and rapid clicks send one request even before the button re-renders as disabled.
- **Theme.** Dark by default, light supported through design tokens in `globals.css`. The choice is stored and applied before first paint.
- **Accessibility.** Native `<dialog>` modals with focus handling and `Esc`, labelled controls, `aria-current`, `aria-pressed` and `aria-live` where state changes, visible focus, and `prefers-reduced-motion` respected for the carousel and transitions.

## Fidelity to the design

Spacing, sizes, radii, type styles and colours were measured from the Figma components and checked against the running app, including hover, focus, error and success states. Prototype timings are used for transitions (300ms ease-out buttons and inputs, 300ms linear card expansion, 700ms carousel arrows, 3s hero advance). A few places intentionally go beyond the static frames:

- Carousels have no visible scrollbar. They scroll with a trackpad, touch, Shift + wheel or mouse dragging.
- The hero carousel pauses while hovered or focused.
- Coming Soon shows four films with a See all toggle, because there is no list page for it.

## Testing

`bun test` covers the pure logic that is easiest to get wrong: seat pricing and ticket-type rules, venue to format narrowing, input masks, the checkout schema, the profile validation messages and the eligibility message.

The interactive flows were stress tested in the browser: rapid repeated clicks on hold, pay, notify, refund and login (each sends one request), a `401` in the middle of booking, a `409` conflict, hold expiry, release on close, malformed URL parameters, missing sessions and films, and horizontal overflow at 375, 768, 1024 and 1920 widths. The light theme was reviewed on the main pages and the booking modal.

## Known limitations

- The live API's seeded account did not accept its documented credentials during development, so the authenticated flows (hold, order, refund, profile save, notify) were exercised against stubbed responses that follow the API documentation. Public endpoints were exercised against the live API.
- The profile update sends a multipart `POST` with `_method=PUT`, because PHP backends do not parse multipart bodies on a real `PUT`. If the API expects a plain `PUT`, change `updateProfile` in `src/features/profile/api.ts`.
- Foyer, food and pickup slots appear in the brief but have no API endpoints, so they are not built.

## Deployment

Not deployed yet. The app is a standard Next.js project and builds with `bun run build`.
