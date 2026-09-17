export const FIND_THE_BEST_ONE_CARD = {
  _id: "find-the-best-one",
  title: "Find the Best One",
  description:
    "Compare our top-rated picks and choose the vape that fits your style, budget, and experience level.",
  imageUrl: "",
};

export function withFindTheBestOneCard(items = []) {
  const hasCard = items.some(
    (item) =>
      item._id === FIND_THE_BEST_ONE_CARD._id ||
      item.title?.trim().toLowerCase() === FIND_THE_BEST_ONE_CARD.title.toLowerCase()
  );

  if (hasCard) return items;
  return [...items, FIND_THE_BEST_ONE_CARD];
}
