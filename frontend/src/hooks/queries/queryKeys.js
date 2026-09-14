export const queryKeys = {
  categories: {
    all: ["categories"],
  },
  brands: {
    all: ["brands"],
  },
  whatsRightForYou: {
    all: ["whats-right-for-you"],
  },
  products: {
    list: (params) => ["products", params],
    infiniteList: (params) => ["products", "infinite", params],
    hotSelling: ["products", "hot-selling"],
    recentlyViewed: (ids) => ["products", "recently-viewed", ids],
  },
};
