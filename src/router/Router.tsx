import { Routes, Route } from 'react-router-dom';
import StartPage from '../pages/StartPage';
import { MyFeed } from '../pages/MyFeed';
import BrowsingFeed from '../pages/BrowsingFeed';
import CenterInfo from '../pages/CenterInfo';

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />}></Route>
      <Route path="/myfeed" element={<MyFeed />}></Route>
      <Route path="/browsingfeed" element={<BrowsingFeed />}></Route>
      <Route path="/centerinfo" element={<CenterInfo />}></Route>
    </Routes>
  );
};

export default Router;
