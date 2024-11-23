import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isSuccessModalOpenState, userNicknameState } from '../../../datas/recoilData';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const SuccessForm: React.FC = () => {
  const navigate = useNavigate();
  const nickname = useRecoilValue(userNicknameState);
  const setIsSuccessModalOpen = useSetRecoilState(isSuccessModalOpenState);

  const goToMyFeed = () => {
    navigate('/my-feed');
    setIsSuccessModalOpen(false);
  };

  console.log('렌더링됨 석세스폼');

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 my-4 font-semibold font-noto">
        <h2 className="mt-6">회원가입 성공!</h2>
        <p className="text-[8rem]">🥳</p>
        <p>
          환영합니다, <span className="text-primary">{nickname}</span>님!
        </p>

        <button
          onClick={goToMyFeed}
          className="w-1/2 py-2 mt-4 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary">
          내 피드로 가기
        </button>
      </div>
    </>
  );
};

export default SuccessForm;
