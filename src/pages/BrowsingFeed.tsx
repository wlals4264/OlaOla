import React from 'react';
import LoginNav from '../components/Basic/LoginNav';
import Nav from '../components/Basic/Nav';
import BrowsingFeedComponent from '../components/Basic/BrowsingFeedComponent';
import { isLoginUserState } from '../datas/recoilData';
import { useRecoilValue } from 'recoil';

export const BrowsingFeed: React.FC = () => {
  const isLoginUser = useRecoilValue(isLoginUserState);

  return (
    <>
      {isLoginUser ? <LoginNav /> : <Nav />}

      <BrowsingFeedComponent />
    </>
  );
};

export default BrowsingFeed;
