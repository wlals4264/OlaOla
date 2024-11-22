import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/firebase';
import { createPortal } from 'react-dom';
import SuccessForm from './SuccessForm';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isJoinModalOpenState,
  isSuccessModalOpenState,
  userEmailState,
  userNicknameState,
} from '../../datas/recoilData';

const JoinForm: React.FC = () => {
  const [email, setEmail] = useRecoilState(userEmailState);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useRecoilState(userNicknameState);

  const [isJoinModalOpen, setIsJoinModalOpen] = useRecoilState(isJoinModalOpenState);
  const setIsSuccessModalOpen = useSetRecoilState(isSuccessModalOpenState);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  // 유효성 검사 함수
  const validateEmail = (email: string) => {
    const validEmail = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (!email) {
      setEmailError('이메일을 입력해주세요.');
    } else if (!validEmail.test(email)) {
      setEmailError('이메일 형식이 올바르지 않습니다.');
    } else {
      setEmailError(null);
    }
  };

  const validatePassword = (password: string) => {
    const validPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
    } else if (!validPassword.test(password)) {
      setPasswordError('비밀번호는 8자 이상, 숫자, 특수문자, 영문을 조합하여야 합니다.');
    } else {
      setPasswordError(null);
    }
  };

  const validatePasswordConfirm = (password: string, passwordConfirm: string) => {
    if (!passwordConfirm) {
      setPasswordConfirmError('비밀번호 확인을 입력해주세요.');
    } else if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordConfirmError(null);
    }
  };

  const validateNickname = (nickname: string) => {
    if (!nickname) {
      setNicknameError('닉네임을 입력해주세요.');
    } else {
      setNicknameError(null);
    }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 초기화 코드
    setEmailError(null);
    setPasswordError(null);
    setPasswordConfirmError(null);
    setNicknameError(null);

    // 유효성 검사 코드 실행
    validateEmail(email);
    validatePassword(password);
    validatePasswordConfirm(password, passwordConfirm);
    validateNickname(nickname);

    // 유효성 검사를 통과하지 못하면 가입을 진행하지 않음
    if (emailError || passwordError || passwordConfirmError || nicknameError) {
      // 닉네임이 비어있으면 포커스를 설정
      if (!nickname) {
        document.getElementById('Nickname')?.focus();
      }

      return;
    }

    try {
      // Firebase에서 사용자 생성
      await createUserWithEmailAndPassword(auth, email, password);

      if (auth.currentUser) {
        // 프로필 업데이트
        await updateProfile(auth.currentUser, {
          displayName: nickname,
        });
      }

      setIsJoinModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  //

  return (
    <>
      {/* 회원가입 모달 */}
      {isJoinModalOpen && (
        <form className="m-6 p-6" onSubmit={signUp}>
          {/* 이메일 */}
          <div className="mb-4">
            <label htmlFor="email" className="text-xs text-gray-400">
              이메일
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value); // 실시간 유효성 검사
              }}
              onBlur={() => validateEmail(email)} // onBlur에서 유효성 검사 실행
              placeholder="Email"
              required
              className={`w-full mt-1 px-4 py-2 border ${
                emailError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300'
              } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary`}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          {/* 비밀번호 */}
          <div className="mb-3">
            <label htmlFor="password" className="text-xs text-gray-400">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value); // 실시간 유효성 검사
              }}
              onBlur={() => validatePassword(password)} // onBlur에서 유효성 검사 실행
              placeholder="Password"
              minLength={8}
              required
              className={`w-full mt-1 px-4 py-2 border ${
                passwordError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300'
              } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary`}
            />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-3">
            <label htmlFor="passwordConfirm" className="text-xs text-gray-400">
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                validatePasswordConfirm(password, e.target.value); // 실시간 유효성 검사
              }}
              onBlur={() => validatePasswordConfirm(password, passwordConfirm)} // onBlur에서 유효성 검사 실행
              placeholder="Password Confirm"
              required
              className={`w-full mt-1 px-4 py-2 border ${
                passwordConfirmError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300'
              } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary`}
            />
            {passwordConfirmError && <p className="text-red-500 text-xs mt-1">{passwordConfirmError}</p>}
          </div>

          {/* 닉네임 */}
          <div className="mb-8">
            <label htmlFor="Nickname" className="text-xs text-gray-400">
              닉네임
            </label>
            <input
              id="Nickname"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                validateNickname(e.target.value); // 실시간 유효성 검사
              }}
              onBlur={() => validateNickname(nickname)} // onBlur에서 유효성 검사 실행
              placeholder="Nickname"
              className={`w-full mt-1 px-4 py-2 border ${
                nicknameError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300'
              } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary`}
            />
            {nicknameError && <p className="text-red-500 text-xs mt-1">{nicknameError}</p>}
          </div>

          {/* 회원가입 버튼 */}
          <button type="submit" className="w-full py-3 bg-primary text-white text-sm rounded-2xl hover:bg-hover">
            회원가입
          </button>
        </form>
      )}
    </>
  );
};

export default JoinForm;
