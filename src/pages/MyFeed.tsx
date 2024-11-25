import React from 'react';
import LoginNav from '../components/Basic/LoginNav';
import UserStateView from '../components/Basic/myFeed/UserStateView';
import FeedList from '../components/Basic/myFeed/FeedList';
import AddFeedButton from '../components/Basic/myFeed/AddFeedButton';
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
