import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Router from './router/Router';
import { initDB } from './utils/indexedDB.ts';

const App: React.FC = () => {
  initDB();

  console.log(window.kakao);

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
