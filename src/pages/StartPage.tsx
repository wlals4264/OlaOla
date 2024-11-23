import React, { useEffect, useState } from 'react';
import Nav from '../components/Basic/Nav';
import Carousel from '../components/Basic/Carousel';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { useSetRecoilState } from 'recoil';
import { userNicknameState } from '../datas/recoilData';
import LoginNav from '../components/Basic/LoginNav';
import Spinner from '../components/Spinner/Spinner';

const StartPage: React.FC = () => {
  const setNickname = useSetRecoilState(userNicknameState);
  const [isLoginUser, setIsLoginUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //mount시 useEffect를 통해 초기 사용자 로그인 상태 확인
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
    </>
  );
};

export default StartPage;
