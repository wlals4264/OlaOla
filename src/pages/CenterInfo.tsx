import React from 'react';
import LoginNav from '../components/Basic/LoginNav';
import { useRecoilValue } from 'recoil';
import { isLoginUserState } from '../datas/recoilData';
import Nav from '../components/Basic/Nav';

export const CenterInfo: React.FC = () => {
  const isLoginUser = useRecoilValue(isLoginUserState);
  return <>{isLoginUser ? <LoginNav /> : <Nav />}</>;
};

export default CenterInfo;
