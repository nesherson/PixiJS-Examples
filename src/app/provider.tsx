import * as React from 'react';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
};
