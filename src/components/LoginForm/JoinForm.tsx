import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase/firebase';

const JoinForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setSuccess(null);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log(result);
      setError(null);
      setSuccess('회원가입 성공!');
    } catch (error) {
      setSuccess(null);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.log(error);
    }
  };

  return (
    <>
      {/* form */}
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Password Confirm"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 에러 메시지 */}
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        {/* 성공 메시지 추가 */}
        {success && <p className="text-primary text-xs mb-4">{success}</p>}

        {/* 회원가입 버튼 */}
        <div className="mb-3">
          <button
            type="submit"
            className="w-full py-2 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:bg-primary">
            회원가입 하기
          </button>
        </div>

        <p className="mb-3 font-semibold text-center">또는</p>

        {/* google 가입 버튼 */}
        <div className="mb-3">
          <button
            type="button"
            className="w-full py-2 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:bg-primary">
            Google로 가입하기
          </button>
        </div>
      </form>
    </>
  );
};

export default JoinForm;