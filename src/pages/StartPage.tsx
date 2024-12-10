import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isLoginUserState, userNicknameState } from '../datas/recoilData';
import Nav from '../components/Basic/Nav';
import Carousel from '../components/Basic/Carousel';
import LoginNav from '../components/Basic/LoginNav';
import ScrollSnap from '../components/Basic/ScrollSnap';
import Spinner from '../components/Spinner/Spinner';

const StartPage: React.FC = () => {
  const setNickname = useSetRecoilState(userNicknameState);
  const [isLoginUser, setIsLoginUser] = useRecoilState(isLoginUserState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('로그인 상태');
        setIsLoginUser(true);
        setNickname(user.displayName ?? '');
      } else {
        console.log('로그아웃 상태');
        setIsLoginUser(false);
        setNickname('');
      }
      setIsLoading(false);
    });
  }, [auth]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {isLoginUser ? <LoginNav /> : <Nav />}

      <Carousel />
      <ScrollSnap />
    </>
  );
};

export default StartPage;
