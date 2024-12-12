import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userImgState, userNicknameState, userUIDState, updateUserUIDState } from '../../../datas/recoilData';
import profileDefaultImg from '../../../assets/svgs/profileDefaultImg.svg';
import { getFileListFromDB } from '../../../utils/indexedDB';

const UserStateView: React.FC = () => {
  const userImg = useRecoilValue(userImgState);
  const nickname = useRecoilValue(userNicknameState);
  const userUID = useRecoilValue(updateUserUIDState);
  const [postCount, setPostCount] = useState<number>(0);

  const userProfileImg = userImg || profileDefaultImg;

  useEffect(() => {
    const fetchPostCount = async () => {
      if (!userUID) {
        setPostCount(0); // userUID가 없으면 게시물 수는 0으로 설정
        return;
      }

      try {
        const files = await getFileListFromDB();
        if (userUID) {
          const filteredFiles = files.filter((fileData: any) => fileData.UID === userUID);
          setPostCount(filteredFiles.length);
        }
      } catch (error) {
        console.error('게시물 수를 가져오는 도중 오류 발생:', error);
      }
    };

    if (userUID) {
      fetchPostCount();
    }
  }, [userUID]);

  return (
    <div className="max-w-2xl m-auto mb-4">
      <div className="mt-24 flex shrink-0 justify-center items-center">
        <img className="w-[120px] h-[120px] rounded-full" src={userProfileImg} alt="UserProfileImg" />
      </div>
      <p className="mt-6 flex shrink-0 justify-center items-center font-bold font-noto">{nickname}</p>
      <div className="flex gap-8 justify-center">
        <div>
          <p className="mt-6 flex shrink-0 justify-center items-center font-semibold font-noto text-sm">게시물</p>
          <p className="mt-4 flex shrink-0 justify-center items-center font-semibold font-noto text-xs">{postCount}</p>
        </div>
        <div>
          <p className="mt-6 flex shrink-0 justify-center items-center font-semibold font-noto text-sm">팔로워</p>
          <p className="mt-4 flex shrink-0 justify-center items-center font-semibold font-noto text-xs">0</p>
        </div>
        <div>
          <p className="mt-6 flex shrink-0 justify-center items-center font-semibold font-noto text-sm">팔로우</p>
          <p className="mt-4 flex shrink-0 justify-center items-center font-semibold font-noto text-xs">0</p>
        </div>
      </div>
    </div>
  );
};

export default UserStateView;
