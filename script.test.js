const { calculateHandValue, checkBlackJack, checkWinner } = require("./script");

test("should return the sum of the given cardss", () => {
  const hand = [
    { suit: "DIAMONDS", value: "2" },
    { suit: "DIAMONDS", value: "5" },
    { suit: "CLUBS", value: "9" },
  ];
  const result = calculateHandValue(hand);
  expect(result).toBe(16);
});

test("should return zero when empty", () => {
  const hand = [];
  const result = calculateHandValue(hand);
  expect(result).toBe(0);
});

test("should return 21 when given blackjack", () => {
  const hand = [
    { suit: "DIAMONDS", value: "A" },
    { suit: "DIAMONDS", value: "K" },
  ];
  const result = calculateHandValue(hand);
  expect(result).toBe(21);
});

test("should return true when given 21 points", () => {
  const BLACKJACK = 21;
  const result = checkBlackJack(BLACKJACK);
  expect(result).toBe(true);
});

test("should return false when given 20 points", () => {
  const points = 20;
  const result = checkBlackJack(points);
  expect(result).toBe(false);
});
