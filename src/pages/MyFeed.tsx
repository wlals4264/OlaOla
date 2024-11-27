import React from 'react';
import LoginNav from '../components/Basic/LoginNav';
import UserStateView from '../components/Basic/MyFeed/UserStateView';
import FeedList from '../components/Basic/MyFeed/FeedList';
import AddFeedButton from '../components/Basic/MyFeed/AddFeedButton';
import { Outlet, useLocation } from 'react-router-dom';

export const MyFeed: React.FC = () => {
  const location = useLocation();
  const isAddFeedPage = location.pathname === '/my-feed/add-feed';

  return (
    <>
      <LoginNav />
      {!isAddFeedPage && (
        <>
          <UserStateView />
          <AddFeedButton />
          <FeedList />
        </>
      )}
      <Outlet />
    </>
  );
};
