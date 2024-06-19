
import React, { createContext, useContext, ReactNode } from 'react';
import { RouteProps } from 'react-router-dom';

interface RouteContextProps {
  routes: RouteProps[];
}

const RouteContext = createContext<RouteContextProps | undefined>(undefined);

export const RouteProvider: React.FC<{ children: ReactNode; routes: RouteProps[] }> = ({ children, routes }) => {
  return (
    <RouteContext.Provider value={{ routes }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouteContext must be used within a RouteProvider');
  }
  return context;
};
