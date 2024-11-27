import React from 'react';
import { useRecoilValue } from 'recoil';
import { userImgState, userNicknameState, climbingLevelState } from '../../../datas/recoilData';
import profileDefaultImg from '../../../assets/svgs/profileDefaultImg.svg';
import { levelOptions } from '../../../datas/levelOptions';

const FeedItem: React.FC = () => {
  const userImg = useRecoilValue(userImgState);
  const nickname = useRecoilValue(userNicknameState);

  const userProfileImg = userImg || profileDefaultImg;

  return (
    <div className="flex px-10 py-6">
      <div className="w-[300px] h-[400px] bg-slate-300 mr-10"></div>
      <div className="w-[360px]">
        <div className="mt-24 flex shrink-0 justify-center items-center">
          <img className="w-[84px] h-[84px] rounded-full" src={userProfileImg} alt="UserProfileImg" />
        </div>
        <p className="mt-6 flex shrink-0 justify-center items-center font-bold font-noto">{nickname}</p>
        {/* <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hover:scale-110 transition-transform ease-in-out cursor-pointer">
          <path
            d="M20 28.7834L26.9167 32.9667C28.1833 33.7334 29.7333 32.6001 29.4 31.1667L27.5667 23.3001L33.6833 18.0001C34.8 17.0334 34.2 15.2001 32.7333 15.0834L24.6833 14.4001L21.5333 6.96672C20.9667 5.61672 19.0333 5.61672 18.4667 6.96672L15.3167 14.3834L7.26667 15.0667C5.8 15.1834 5.2 17.0167 6.31667 17.9834L12.4333 23.2834L10.6 31.1501C10.2667 32.5834 11.8167 33.7167 13.0833 32.9501L20 28.7834Z"
            fill={option.color}
            stroke={option.color !== 'white' ? '' : '#8C8C8C'}
          />
        </svg> */}
      </div>
    </div>
  );
};

export default FeedItem;
