import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../Firebase/firebase';
import JoinForm from './JoinForm';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isJoinModalOpenState,
  isLoginModalOpenState,
  userEmailState,
  userNicknameState,
  userImgState,
  userTokenState,
  isLoginUserState,
} from '../../../datas/recoilData';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useRecoilState(userEmailState);
  const [password, setPassword] = useState<string>('');
  const setNickname = useSetRecoilState(userNicknameState);
  const setUserImg = useSetRecoilState(userImgState);
  const setUserToken = useSetRecoilState(userTokenState);
  const [error, setError] = useState<string | null>(null);
  const [isJoinModalOpen, setJoinModalOpen] = useRecoilState(isJoinModalOpenState);
  const [isLoginModalOpen, setLoginModalOpen] = useRecoilState(isLoginModalOpenState);
  const setIsLoginUser = useSetRecoilState(isLoginUserState);

  const navigate = useNavigate();

  // 구글 로그인 함수
  function googleLogin(e: React.FormEvent) {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setError(null);
        navigate('/my-feed');

        // 프로필 업데이트
        if (result.user.displayName) {
          setNickname(result.user.displayName);
          setUserImg(result.user.photoURL);
        } else {
          console.log('닉네임 없음');
        }

        // 구글 로그인 후 토큰 받기
        const token = await result.user.getIdToken();
        setUserToken(token);
        localStorage.setItem('userToken', token);

        // 로그인 상태 업데이트
        if (token) {
          setIsLoginUser(true);
        }
      })
      .catch((error) => {
        console.log('구글 로그인 오류', error);
        setError('구글 로그인에 실패하였습니다.');
      });
  }

  // 이메일 로그인 함수
  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password).then(async (result) => {
        // 프로필 업데이트
        if (result.user.displayName) {
          setNickname(result.user.displayName);
          setUserImg(result.user.photoURL);
        } else {
          console.log('닉네임 없음');
        }

        // 로그인 후 토큰 받기
        const token = await result.user.getIdToken();
        setUserToken(token);
        localStorage.setItem('userToken', token);

        // 로그인 상태 업데이트
        if (token) {
          setIsLoginUser(true);
        }
      });

      setError(null);
      navigate('/my-feed');
    } catch (error) {
      setError('로그인에 실패하였습니다. 다시 시도해주세요.');
    }
  };

  const handleOpenJoinModal = () => {
    setJoinModalOpen(true);
    setLoginModalOpen(false);
  };

  return (
    <>
      {isLoginModalOpen && (
        <form className="m-6 p-6">
          {/* 이메일 */}
          <div className="mb-4">
            <label htmlFor="email" className="text-xs text-gray-400">
              이메일
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-6">
            <label htmlFor="password" className="text-xs text-gray-400">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

          {/* 로그인 버튼 */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:bg-primary"
              onClick={signIn}>
              로그인
            </button>
          </div>

          <p className="mb-4 font-semibold text-center">또는</p>

          {/* google 로그인 버튼 */}
          <div className="mb-4">
            <button
              className="w-full py-2 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={googleLogin}>
              <div className="flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_8_947)">
                    <path
                      d="M19.5312 10.2266C19.5312 15.7539 15.7461 19.6875 10.1562 19.6875C4.79688 19.6875 0.46875 15.3594 0.46875 10C0.46875 4.64063 4.79688 0.3125 10.1562 0.3125C12.7656 0.3125 14.9609 1.26953 16.6523 2.84766L14.0156 5.38281C10.5664 2.05469 4.15234 4.55469 4.15234 10C4.15234 13.3789 6.85156 16.1172 10.1562 16.1172C13.9922 16.1172 15.4297 13.3672 15.6562 11.9414H10.1562V8.60937H19.3789C19.4688 9.10547 19.5312 9.58203 19.5312 10.2266Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_8_947">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Google로 로그인 하기
              </div>
            </button>
          </div>

          <p className="mb-4 font-semibold text-center">혹시 아직 회원이 아니시라면?</p>

          {/* 회원가입 버튼 */}
          <div className="mb-4">
            <button
              type="submit"
              onClick={handleOpenJoinModal}
              className="w-full py-2 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:bg-primary">
              회원가입 하기
            </button>
          </div>
        </form>
      )}
      {isJoinModalOpen && <JoinForm />} {/* 회원가입 폼 */}
    </>
  );
};

export default LoginForm;
