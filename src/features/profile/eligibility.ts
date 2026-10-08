import type { AgeRating } from "@/types/api";

export function getEligibilityMessage(age: number, ratings: AgeRating[]) {
  const eligible = ratings
    .filter((rating) => rating.minAge <= age)
    .sort((a, b) => a.minAge - b.minAge);

  if (eligible.length === ratings.length || eligible.length === 0) {
    return `You are ${age}, you can buy tickets for all age ratings`;
  }

  const highest = eligible[eligible.length - 1];
  return `You are ${age}, you can buy tickets for ratings up to ${highest.code}`;
}
