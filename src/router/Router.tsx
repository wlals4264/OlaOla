import { Routes, Route } from 'react-router-dom';
import StartPage from '../pages/StartPage';
import { MyFeed } from '../pages/MyFeed';
import BrowsingFeed from '../pages/BrowsingFeed';
import CenterInfo from '../pages/CenterInfo';
import AddFeed from '../components/Basic/myFeed/AddFeed';

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />}></Route>
      <Route path="/my-feed" element={<MyFeed />}></Route>
      <Route path="/add-feed" element={<AddFeed />}></Route>
      <Route path="/browsing-feed" element={<BrowsingFeed />}></Route>
      <Route path="/center-info" element={<CenterInfo />}></Route>
    </Routes>
  );
};

export default Router;
