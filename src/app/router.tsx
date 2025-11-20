import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from '../config/paths';
import Home from './routes/app/home';
import AppRoot from './routes/app/root';
import Test from './routes/app/test';

const createAppRouter = () =>
    createBrowserRouter([
        {
            path: paths.home.path,
            element: (
                <AppRoot />
            ),
            children: [
                {
                    path: paths.home.path,
                    Component: Home
                },
                {
                    path: paths.test.path,
                    Component: Test
                }
            ],
        },
    ]);

export const AppRouter = () => {
    const router = createAppRouter();

    return <RouterProvider router={router} />;
};
