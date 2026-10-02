# Kino XII

A cinema network booking app built for the Redberry Bootcamp XII assignment. Browse films, filter sessions, pick seats in one of four halls and buy tickets.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, TanStack Query, axios, nuqs, react-hook-form with zod, zustand, motion and Biome.

## Getting started

```bash
bun install
cp .env.example .env.local
bun dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description                  |
| -------------- | ---------------------------- |
| `bun dev`      | Start the development server |
| `bun run build`| Create a production build    |
| `bun start`    | Serve the production build   |
| `bun run lint` | Check code with Biome        |
| `bun run format` | Format code with Biome     |

## Environment

| Variable              | Description                |
| --------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Kino XII API |
