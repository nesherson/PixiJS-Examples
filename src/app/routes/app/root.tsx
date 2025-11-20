import { Outlet } from 'react-router';

import MainLayout from '../../../layouts/MainLayout';

const AppRoot = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AppRoot;
