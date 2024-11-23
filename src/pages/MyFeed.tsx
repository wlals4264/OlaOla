import React from 'react';
import LoginNav from '../components/Basic/LoginNav';
import UserStateView from '../components/Basic/myFeed/UserStateView';

export const MyFeed: React.FC = () => {
  return (
    <>
      <LoginNav />
      <UserStateView />
    </>
  );
};
