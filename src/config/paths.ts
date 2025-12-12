export const paths = {
  home: {
    name: 'Home',
    path: '/',
    getHref: () => '/',
  },
  pointsAndLines: {
    name: 'Points and lines',
    path: '/points-and-lines',
    getHref: () => '/points-and-lines',
  },
} as const;

export type RouteKeys = keyof typeof paths;
