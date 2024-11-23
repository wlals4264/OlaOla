import React from 'react';
import LoginNav from '../components/Basic/LoginNav';
import UserStateView from '../components/Basic/myFeed/UserStateView';
import FeedList from '../components/Basic/myFeed/FeedList';
import AddFeedButton from '../components/Basic/myFeed/AddFeedButton';

export const MyFeed: React.FC = () => {
  return (
    <>
      <LoginNav />
      <UserStateView />
      <AddFeedButton />
      <FeedList />
    </>
  );
};
