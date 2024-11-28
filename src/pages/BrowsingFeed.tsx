import React from 'react';
import LoginNav from '../components/Basic/LoginNav';
import BrowsingFeedComponent from '../components/Basic/BrowsingFeedComponent';

export const BrowsingFeed: React.FC = () => {
  return (
    <>
      <LoginNav />
      <BrowsingFeedComponent />
    </>
  );
};

export default BrowsingFeed;
