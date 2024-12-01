import React from 'react';
import LoginNav from '../components/Basic/LoginNav';
import Nav from '../components/Basic/Nav';
import CenterInfoComponent from '../components/Basic/CenterInfo/CenterInfoComponent';
import { useRecoilValue } from 'recoil';
import { isLoginUserState } from '../datas/recoilData';

export const CenterInfo: React.FC = () => {
  const isLoginUser = useRecoilValue(isLoginUserState);
  return (
    <>
      {isLoginUser ? <LoginNav /> : <Nav />}
      <CenterInfoComponent />
    </>
  );
};

export default CenterInfo;
