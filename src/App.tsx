import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Router from './router/Router';

const App: React.FC = () => {
  return (
    <>
      <div className="bg-bg-color min-w-full min-h-screen">
        <RecoilRoot>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </RecoilRoot>
      </div>
    </>
  );
};

export default App;
