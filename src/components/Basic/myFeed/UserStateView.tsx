import React from 'react';
import { useRecoilValue } from 'recoil';
import { userImgState, userNicknameState } from '../../../datas/recoilData';
import profileDefaultImg from '../../../assets/svgs/profileDefaultImg.svg';

const UserStateView: React.FC = () => {
  const userImg = useRecoilValue(userImgState);
  const nickname = useRecoilValue(userNicknameState);

  const userProfileImg = userImg || profileDefaultImg;

  return (
    <div className="max-w-2xl m-auto">
      <div className="mt-24 flex shrink-0 justify-center items-center">
        <img className="w-[120px] h-[120px] rounded-full" src={userProfileImg} alt="UserProfileImg" />
      </div>
      <p className="mt-6 flex shrink-0 justify-center items-center font-bold font-noto">{nickname}</p>
      <div className="flex gap-8 justify-center">
        <div>
          <p className="mt-6 flex shrink-0 justify-center items-center font-semibold font-noto text-sm">게시물</p>
          <p className="mt-4 flex shrink-0 justify-center items-center font-semibold font-noto text-xs">14</p>
        </div>
        <div>
          <p className="mt-6 flex shrink-0 justify-center items-center font-semibold font-noto text-sm">팔로워</p>
          <p className="mt-4 flex shrink-0 justify-center items-center font-semibold font-noto text-xs">0</p>
        </div>
        <div>
          <p className="mt-6 flex shrink-0 justify-center items-center font-semibold font-noto text-sm">팔로우</p>
          <p className="mt-4 flex shrink-0 justify-center items-center font-semibold font-noto text-xs">2</p>
        </div>
      </div>
    </div>
  );
};

export default UserStateView;
