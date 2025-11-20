export const paths = {
  home: {
    name: "Home",
    path: "/",
    getHref: () => "/",
  },
  test: {
    name: "Test",
    path: "/test",
    getHref: () => "/test",
  },
} as const;

export type RouteKeys = keyof typeof paths;
