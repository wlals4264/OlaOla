import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { isLoginUserState, userImgState, userNicknameState } from '../datas/recoilData';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useAuthState = () => {
  const setNickname = useSetRecoilState(userNicknameState);
  const setUserImg = useSetRecoilState(userImgState);
  const setIsLoginUser = useSetRecoilState(isLoginUserState);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 사용자 정보가 있으면 닉네임 업데이트
        const userNickname = user.displayName || '';
        const userImg = user.photoURL || null;
        setNickname(userNickname);
        setUserImg(userImg);
        setIsLoginUser(true);
      } else {
        // 로그아웃 상태
        setNickname('');
        setUserImg(null);
        setIsLoginUser(false);
      }
    });

    // 컴포넌트 언마운트 시
    return () => unsubscribe();
  }, [setUserImg, setNickname, setIsLoginUser]);
};

export default useAuthState;
