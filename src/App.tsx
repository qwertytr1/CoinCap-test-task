import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./app/header/Header";
import PortfolioModal from './app/modals/portfolioModal/PortfolioModal';
import routes from './app/routes/routes';
import ErrorPage from './app/errorPage/ErrorPage';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <Header />
          <PortfolioModal />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.component />} />
              ))}
              <Route path="*" element={<ErrorPage />} /> {/* Handling unmatched paths */}
            </Routes>
          </Suspense>
        </div>
      </Router>
    </>
  );
};

export default App;
