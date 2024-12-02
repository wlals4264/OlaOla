import React from 'react';
import LoginNav from '../components/Basic/LoginNav';
import Nav from '../components/Basic/Nav';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoginUserState } from '../datas/recoilData';

export const CenterInfo: React.FC = () => {
  const isLoginUser = useRecoilValue(isLoginUserState);
  return (
    <>
      {isLoginUser ? <LoginNav /> : <Nav />}
      <div className="center-info-content">
        <Outlet />
      </div>
    </>
  );
};

export default CenterInfo;
