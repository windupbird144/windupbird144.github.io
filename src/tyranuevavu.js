export const TYRANU = "tyranu";
export const EVAVU = "evavu";
export const EITHER = "either";

export const T = 10;
export const J = 11;
export const Q = 12;
export const K = 13;
export const A = 14;

const values = [2, 3, 4, 5, 6, 7, 8, 9, T, J, Q, K, A];

export function evaluate(s) {
  const x = parseString(s);
  const seen = x.slice(0, -1);
  const top = x.slice(-1)[0];
  return computeOdds(top, seen);
}

/**
 *
 * @param {string} s
 */
export function parseString(s) {
  const re = /[^0-9TJQKA]/g;
  s = s.toUpperCase();
  s = s.replace(re, "");
  s = s.split("").map(parseCard);
  return s;
}

export function parseCard(character) {
  character = `${character}`;
  if (character.length != 1) return;
  const fromMap = {
    J: J,
    Q: Q,
    K: K,
    A: A,
    T: T,
    0: T,
    1: T,
  }[character];
  if (fromMap) return fromMap;
  const fromParse = parseInt(character);
  if (values.includes(fromParse)) return fromParse;
}

/**
 * return the slices left and right of <item>
 *
 * @param {T[]} array an array
 * @param {T} item an item in the array
 * @returns {[T[], T[]]} left and right of item
 */
export function partition(array, item) {
  const i = array.indexOf(item);
  return [array.slice(0, i), array.slice(i + 1)];
}

/**
 *
 * @param {number} currentCard
 * @param {number[]} cardsSeen
 */
export function computeOdds(currentCard, cardsSeen) {
  const [lower, higher] = partition(values, currentCard);
  const countLower = lower.length * 4;
  const countHigher = higher.length * 4;
  const seenLower = cardsSeen.filter((e) => e < currentCard).length;
  const seenHigher = cardsSeen.filter((e) => e > currentCard).length;

  const actualLower = countLower - seenLower;
  const actualHigher = countHigher - seenHigher;
  const [bestChoice, odds] = calculateBestChoice(actualLower, actualHigher);
  return {
    odds,
    actualLower,
    actualHigher,
    bestChoice,
  };
}

function calculateBestChoice(lower, higher) {
  const total = lower + higher;
  if (lower == higher) return [EITHER, lower / total];
  if (lower > higher) return [EVAVU, lower / total];
  return [TYRANU, higher / total];
}
