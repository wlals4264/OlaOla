import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../Firebase/firebase';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isJoinModalOpenState,
  isLoginUserState,
  isSuccessModalOpenState,
  userEmailState,
  userNicknameState,
} from '../../../datas/recoilData';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateNickname,
  handleValidation,
} from '../../../utils/validation';

const JoinForm: React.FC = () => {
  const [email, setEmail] = useRecoilState(userEmailState);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useRecoilState(userNicknameState);

  const [isJoinModalOpen, setIsJoinModalOpen] = useRecoilState(isJoinModalOpenState);
  const setIsSuccessModalOpen = useSetRecoilState(isSuccessModalOpenState);
  const setIsLoginUser = useSetRecoilState(isLoginUserState);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 초기화 코드
    setEmailError(null);
    setPasswordError(null);
    setPasswordConfirmError(null);
    setNicknameError(null);

    // 유효성 검사 실행
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const passwordConfirmValidationError = validatePasswordConfirm(password, passwordConfirm);
    const nicknameValidationError = validateNickname(nickname);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setPasswordConfirmError(passwordConfirmValidationError);
    setNicknameError(nicknameValidationError);

    // 유효성 검사를 통과하지 못하면 가입을 진행하지 않음
    if (emailValidationError || passwordValidationError || passwordConfirmValidationError || nicknameValidationError) {
      // 닉네임이 비어있으면 포커스를 설정
      if (!nickname) {
        document.getElementById('Nickname')?.focus();
      }
      return;
    }

    try {
      // Firebase에서 사용자 생성
      await createUserWithEmailAndPassword(auth, email, password);

      // 프로필 업데이트
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: nickname,
        });
      }

      setIsJoinModalOpen(false);
      setIsSuccessModalOpen(true);
      setNickname(nickname);
      setIsLoginUser(true);
    } catch (error: any) {
      console.log(error);
      // 에러 처리
      if (error.code === 'auth/email-already-in-use') {
        setJoinError('이미 가입된 email입니다.');
      } else {
        setJoinError('가입에 실패했습니다. 관계자에게 문의하세요.');
      }
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
                // handleValidation(e.target.value, validateEmail, setEmailError);
              }}
              onBlur={() => handleValidation(email, validateEmail, setEmailError)}
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
                // handleValidation(e.target.value, validatePassword, setPasswordError);
              }}
              onBlur={() => handleValidation(password, validatePassword, setPasswordError)}
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
                // handleValidation(
                //   e.target.value,
                //   (value) => validatePasswordConfirm(password, value),
                //   setPasswordConfirmError
                // );
              }}
              onBlur={() =>
                handleValidation(
                  passwordConfirm,
                  (value) => validatePasswordConfirm(password, value),
                  setPasswordConfirmError
                )
              }
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
                validateNickname(e.target.value);
              }}
              onBlur={() => validateNickname(nickname)}
              placeholder="Nickname"
              className={`w-full mt-1 px-4 py-2 border ${
                nicknameError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300'
              } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary`}
            />
            {nicknameError && <p className="text-red-500 text-xs mt-1">{nicknameError}</p>}
          </div>

          {joinError && <p className="text-red-500 text-sm my-6">{joinError}</p>}

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
