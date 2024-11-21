import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import

interface SuccessFormProps {
  displayName: string;
}

const SuccessForm: React.FC<SuccessFormProps> = ({ displayName }) => {
  const navigate = useNavigate(); // navigate 훅 사용

  const goToHome = () => {
    navigate('/myfeed');
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 my-4 font-semibold font-noto">
        <h2 className="mt-6">회원가입 성공!</h2>
        <p className="text-[8rem]">🥳</p>
        <p>
          환영합니다, <span className="text-primary">{displayName}</span>님!
        </p>

        <button
          onClick={goToHome}
          className="w-1/2 py-2 mt-4 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary">
          홈으로 가기
        </button>
      </div>
    </>
  );
};

export default SuccessForm;
