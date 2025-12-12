import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { paths } from "@/config/paths";
import Home from "./routes/app/home";
import AppRoot from "./routes/app/root";
import PointsAndLines from "./routes/app/points-and-lines";
import CoordinatePlane from "./routes/app/coordinate-plane";

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: <AppRoot />,
      children: [
        {
          path: paths.home.path,
          element: <AppRoot />,
          children: [
            {
              path: paths.home.path,
              Component: Home,
            },
            {
              path: paths.pointsAndLines.path,
              Component: PointsAndLines,
            },
            {
              path: paths.coordinatePlane.path,
              Component: CoordinatePlane,
            },
          ],
        },
        {
          path: paths.pointsAndLines.path,
          Component: PointsAndLines,
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const router = createAppRouter();

  return <RouterProvider router={router} />;
};
