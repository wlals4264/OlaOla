import { Routes, Route } from 'react-router-dom';
import StartPage from '../pages/StartPage';
import { MyFeed } from '../pages/MyFeed';
import BrowsingFeed from '../pages/BrowsingFeed';
import CenterInfo from '../pages/CenterInfo';
import ModifyFeed from '../components/Basic/MyFeed/ModifyFeed';
import AddFeed from '../components/Basic/MyFeed/AddFeed/AddFeed';
import ProtectedRoute from '../components/Basic/ProtectedRoute/ProtectedRoute';
import FindCenter from '../components/Basic/CenterInfo/FindCenter';
import NewSettings from '../components/Basic/CenterInfo/NewSettings';
import CenterReviews from '../components/Basic/CenterInfo/CenterReviews';

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />}></Route>
      <Route
        path="/my-feed"
        element={
          <ProtectedRoute>
            <MyFeed />
          </ProtectedRoute>
        }></Route>
      <Route
        path="/my-feed/add-feed"
        element={
          <ProtectedRoute>
            <AddFeed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-feed/modify-feed"
        element={
          <ProtectedRoute>
            <ModifyFeed />
          </ProtectedRoute>
        }
      />
      <Route path="/browsing-feed" element={<BrowsingFeed />}></Route>
      <Route path="/center-info" element={<CenterInfo />}>
        <Route index element={<FindCenter />} /> {/* 기본 경로에서 FindCenter 표시 */}
        <Route path="/center-info/new-settings" element={<ProtectedRoute>{<NewSettings />}</ProtectedRoute>} />
        <Route path="/center-info/center-reviews" element={<ProtectedRoute>{<CenterReviews />}</ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

export default Router;
