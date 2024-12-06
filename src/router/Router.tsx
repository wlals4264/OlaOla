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
import ModifyPost from '../components/Basic/CenterInfo/UserCommunity/ModifyPost';

const Router = (): JSX.Element => {
  return (
    <Routes>
      {/* 시작 페이지 */}
      <Route path="/" element={<StartPage />}></Route>

      {/* My Feed */}
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

      {/* Browsing Feed */}
      <Route path="/browsing-feed" element={<BrowsingFeed />}></Route>

      {/* Center Info */}
      <Route path="/center-info" element={<CenterInfo />}>
        <Route index element={<FindCenter />} /> {/* 기본 경로 */}
        <Route
          path="user-community"
          element={
            <ProtectedRoute>
              <UserCommunity />
            </ProtectedRoute>
          }
        />
        <Route
          path="user-community/add-post"
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
        <Route
          path="user-community/post/:postId/modify-post"
          element={
            <ProtectedRoute>
              <ModifyPost />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default Router;
