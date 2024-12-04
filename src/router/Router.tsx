import { Routes, Route } from 'react-router-dom';
import StartPage from '../pages/StartPage';
import { MyFeed } from '../pages/MyFeed';
import BrowsingFeed from '../pages/BrowsingFeed';
import CenterInfo from '../pages/CenterInfo';
import ModifyFeed from '../components/Basic/MyFeed/ModifyFeed';
import AddFeed from '../components/Basic/MyFeed/AddFeed/AddFeed';
import ProtectedRoute from '../components/Basic/ProtectedRoute/ProtectedRoute';
import FindCenter from '../components/Basic/CenterInfo/FindCenter/FindCenter';
import UserCommunity from '../components/Basic/CenterInfo/UserCommunity/UserCommunity';

import AddPost from '../components/Basic/CenterInfo/UserCommunity/AddPost';
import PostItem from '../components/Basic/CenterInfo/UserCommunity/PostItem';

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
        <Route path="/center-info/user-community" element={<ProtectedRoute>{<UserCommunity />}</ProtectedRoute>} />
        <Route
          path="/center-info/user-community/add-post"
          element={
            <ProtectedRoute>
              <AddPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="user-community/post/:postId"
          element={
            <ProtectedRoute>
              <PostItem />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default Router;
