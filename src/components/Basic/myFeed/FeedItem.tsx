import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  userImgState,
  userNicknameState,
  isFeedItemModalOpenState,
  isLoginUserState,
  userUIDState,
} from '../../../datas/recoilData';
import profileDefaultImg from '../../../assets/svgs/profileDefaultImg.svg';
import { levelOptions } from '../../../datas/levelOptions';
import { updateFileInDB, deleteFileInDB } from '../../../utils/indexedDB';
import { useNavigate, useLocation } from 'react-router-dom';
import Comment from './Comment';

interface FeedItemProps {
  feedItem: {
    file: File;
    type: string;
    id: number;
    describe: string;
    level: string;
    niceCount: number;
    centerName: string;
    userUID: string;
  };
}
const FeedItem: React.FC<FeedItemProps> = ({ feedItem }) => {
  console.log(feedItem);
  const userImg = useRecoilValue(userImgState);
  const nickname = useRecoilValue(userNicknameState);
  const setFeedItemModalOpen = useSetRecoilState(isFeedItemModalOpenState);
  const userProfileImg = userImg || profileDefaultImg;
  const levelColor = levelOptions.find((option) => option.value === feedItem.level)?.color || 'white';
  const [fileUrl, setFileUrl] = useState<string>('');
  const [niceCount, setNiceCount] = useState(feedItem.niceCount);
  // 로그인 상태와 userUID 가져오기
  const isLogin = useRecoilValue(isLoginUserState);
  const userUID = useRecoilValue(userUIDState);

  // my-feed 페이지의 FeedItem창에서만 수정하기 버튼 열리기
  const location = useLocation();
  const isEditPage = location.pathname.includes('/my-feed');

  const navigate = useNavigate();

  // 파일 Blob url 생성
  useEffect(() => {
    const url = URL.createObjectURL(feedItem.file);
    setFileUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [feedItem.file]);

  // 나이스 버튼 핸들러 함수
  const handleNiceButtonClick = () => {
    console.log('Nice button click');

    if (!isLogin || !userUID) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    // 나이스를 누른 유저인지 확인하기 위한 값 불러오기
    const hasClicked = localStorage.getItem(`hasClicked_${userUID}`);

    if (hasClicked) {
      // 이미 나이스를 눌렀다면 나이스 수 감소
      setNiceCount((prevCount) => prevCount - 1);
      // 클릭 기록 삭제
      localStorage.removeItem(`hasClicked_${userUID}`);
      // DB 업데이트
      updateFileInDB(feedItem.id, { niceCount: niceCount });
    } else {
      // 누르지 않았다면 나이스 수 증가
      setNiceCount((prevCount) => prevCount + 1);
      // DB 업데이트
      updateFileInDB(feedItem.id, { niceCount: niceCount });
      // 클릭 기록 저장
      localStorage.setItem(`hasClicked_${userUID}`, true);
    }
  };

  // 수정 버튼 핸들러 함수
  const handleOpenModifyModal = () => {
    navigate('modify-feed', { state: { feedItem, fileUrl } });
  };

  // 삭제 버튼 핸들러 함수
  const handleDeleteButtonClick = (id: number) => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      deleteFileInDB(feedItem.id);
      setFeedItemModalOpen(false);
      navigate(0);
    }
  };

  return (
    <div className="flex px-10 py-6">
      <div className="w-[300px] h-[400px] relative mr-16">
        {/* 선택된 피드 이미지 & 비디오 렌더링 */}
        {feedItem.type.startsWith('image') ? (
          <img src={fileUrl} alt={'선택한 피드 이미지'} className="w-full h-full object-cover rounded-2xl m-auto" />
        ) : feedItem.type.startsWith('video') ? (
          <video
            src={fileUrl}
            autoPlay
            muted
            loop
            className="absolute top-[50%] left-[50%] w-full h-full object-cover transition-transform -translate-x-1/2 -translate-y-1/2 rounded-2xl p-0">
            해당 비디오 타입을 지원하지 않습니다.
          </video>
        ) : (
          <p>지원하지 않는 형식입니다.</p>
        )}
      </div>

      <div className="w-[360px] h-[400px]">
        <div className="flex-col shrink-0 justify-center items-center">
          <img className="w-[100px] h-[100px] rounded-full" src={userProfileImg} alt="UserProfileImg" />
          <p className="mt-2 flex gap-4 shrink-0 items-center font-bold font-noto">
            {nickname}
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.7384 16.9615L15.5883 19.8948C16.4764 20.4324 17.5633 19.6377 17.3295 18.6327L16.044 13.1167L20.3329 9.40045C21.1159 8.72263 20.6952 7.43713 19.6668 7.35533L14.0223 6.87618L11.8136 1.66405C11.4162 0.717452 10.0606 0.717452 9.66325 1.66405L7.45452 6.8645L1.81 7.34364C0.781593 7.42544 0.360883 8.71095 1.14387 9.38876L5.43278 13.105L4.14728 18.621C3.91355 19.626 5.00038 20.4207 5.88855 19.8831L10.7384 16.9615Z"
                fill={levelColor}
                stroke={levelColor !== 'white' ? '' : '#8C8C8C'}
              />
            </svg>
          </p>
          <div className="w-[360px] min-h-24 mt-2">
            <p className="font-noto font-normal text-sm">{feedItem.describe}</p>
          </div>
        </div>

        {/* 암장명 */}
        {feedItem.centerName ? (
          <p className="flex justify-center items-center mb-2 text-xs text-white bg-primary max-w-fit px-[8px] py-[2px] rounded-xl cursor-pointer">
            # {feedItem.centerName}
          </p>
        ) : (
          <p className="flex justify-center items-center mb-2 text-xs text-white max-w-fit px-[8px] py-[2px] rounded-xl cursor-default">
            ' '
          </p>
        )}

        {/* 구분선 */}
        <div className="w-[360px] border-t-[0.5px] border-solid border-gray-500"></div>

        {/* 나이스 정보 & 수정 & 삭제 버튼 */}
        <div className="w-[360px] flex flex-col justify-between">
          <div className="w-[360px] mt-2 flex gap-4 items-center justify-between">
            {/* 나이스 버튼 */}
            <div className="flex items-center gap-4">
              <svg
                onClick={handleNiceButtonClick}
                className="cursor-pointer hover:scale-110"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_8_1389)">
                  <path
                    d="M4.0625 8.75H0.9375C0.419727 8.75 0 9.16973 0 9.6875V19.0625C0 19.5803 0.419727 20 0.9375 20H4.0625C4.58027 20 5 19.5803 5 19.0625V9.6875C5 9.16973 4.58027 8.75 4.0625 8.75ZM2.5 18.4375C1.98223 18.4375 1.5625 18.0178 1.5625 17.5C1.5625 16.9822 1.98223 16.5625 2.5 16.5625C3.01777 16.5625 3.4375 16.9822 3.4375 17.5C3.4375 18.0178 3.01777 18.4375 2.5 18.4375ZM15 3.18172C15 4.83859 13.9855 5.76797 13.7001 6.875H17.6737C18.9782 6.875 19.9939 7.95883 20 9.14445C20.0032 9.84516 19.7052 10.5995 19.2406 11.0662L19.2363 11.0705C19.6205 11.9821 19.5581 13.2595 18.8727 14.1748C19.2118 15.1863 18.87 16.4288 18.2328 17.095C18.4007 17.7824 18.3205 18.3674 17.9927 18.8384C17.1954 19.9839 15.2194 20 13.5484 20L13.4373 20C11.5511 19.9993 10.0073 19.3125 8.76695 18.7607C8.14363 18.4834 7.32863 18.1401 6.71027 18.1288C6.4548 18.1241 6.25 17.9156 6.25 17.6601V9.30969C6.25 9.18469 6.30008 9.06473 6.38898 8.97684C7.93641 7.44777 8.6018 5.82891 9.87012 4.55844C10.4484 3.97906 10.6587 3.10391 10.862 2.25758C11.0357 1.53488 11.3991 0 12.1875 0C13.125 0 15 0.3125 15 3.18172Z"
                    fill="#A5E1FF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_8_1389">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="flex items-center gap-2 font-noto font-normal text-md cursor-default">
                <p>{niceCount}</p>nice
              </span>
            </div>
            {isEditPage && (
              // 수정 및 삭제 버튼
              <div className="flex gap-4">
                {/* 수정하기 버튼 */}
                <svg
                  onClick={handleOpenModifyModal}
                  className="cursor-pointer hover:scale-110"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="#A5E1FF"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.6856 3.99352L16.6863 8.99438L5.8276 19.8535L1.36912 20.3457C0.772263 20.4118 0.26798 19.9071 0.334384 19.3102L0.830465 14.8484L11.6856 3.99352ZM19.7792 3.24897L17.4312 0.900888C16.6988 0.168454 15.5109 0.168454 14.7785 0.900888L12.5696 3.10991L17.5703 8.11077L19.7792 5.90175C20.5116 5.16893 20.5116 3.98141 19.7792 3.24897Z"
                    fill="#A5E1FF"
                  />
                </svg>
                {/* 삭제하기 버튼 */}
                <button>
                  <svg
                    onClick={() => handleDeleteButtonClick(feedItem.id)}
                    className="cursor-pointer hover:scale-110"
                    width="18"
                    height="21"
                    viewBox="0 0 18 21"
                    fill="#A5E1FF"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.28571 18.6429C1.28571 19.1544 1.4889 19.6449 1.85058 20.0066C2.21226 20.3682 2.7028 20.5714 3.21429 20.5714H14.7857C15.2972 20.5714 15.7877 20.3682 16.1494 20.0066C16.5111 19.6449 16.7143 19.1544 16.7143 18.6429V5.14286H1.28571V18.6429ZM12.2143 8.35715C12.2143 8.18665 12.282 8.02314 12.4026 7.90258C12.5231 7.78202 12.6866 7.71429 12.8571 7.71429C13.0276 7.71429 13.1912 7.78202 13.3117 7.90258C13.4323 8.02314 13.5 8.18665 13.5 8.35715V17.3571C13.5 17.5276 13.4323 17.6912 13.3117 17.8117C13.1912 17.9323 13.0276 18 12.8571 18C12.6866 18 12.5231 17.9323 12.4026 17.8117C12.282 17.6912 12.2143 17.5276 12.2143 17.3571V8.35715ZM8.35714 8.35715C8.35714 8.18665 8.42487 8.02314 8.54543 7.90258C8.66599 7.78202 8.8295 7.71429 9 7.71429C9.1705 7.71429 9.33401 7.78202 9.45457 7.90258C9.57513 8.02314 9.64286 8.18665 9.64286 8.35715V17.3571C9.64286 17.5276 9.57513 17.6912 9.45457 17.8117C9.33401 17.9323 9.1705 18 9 18C8.8295 18 8.66599 17.9323 8.54543 17.8117C8.42487 17.6912 8.35714 17.5276 8.35714 17.3571V8.35715ZM4.5 8.35715C4.5 8.18665 4.56773 8.02314 4.68829 7.90258C4.80885 7.78202 4.97236 7.71429 5.14286 7.71429C5.31335 7.71429 5.47687 7.78202 5.59743 7.90258C5.71798 8.02314 5.78571 8.18665 5.78571 8.35715V17.3571C5.78571 17.5276 5.71798 17.6912 5.59743 17.8117C5.47687 17.9323 5.31335 18 5.14286 18C4.97236 18 4.80885 17.9323 4.68829 17.8117C4.56773 17.6912 4.5 17.5276 4.5 17.3571V8.35715ZM17.3571 1.28572H12.5357L12.158 0.534382C12.078 0.373754 11.9548 0.238637 11.8022 0.144231C11.6496 0.0498262 11.4736 -0.000121659 11.2942 7.0444e-06H6.70179C6.52274 -0.000681236 6.34712 0.0490804 6.19506 0.143591C6.04299 0.238101 5.92062 0.373537 5.84196 0.534382L5.46429 1.28572H0.642857C0.472361 1.28572 0.308848 1.35345 0.188289 1.47401C0.0677294 1.59457 0 1.75808 0 1.92858L0 3.21429C0 3.38479 0.0677294 3.5483 0.188289 3.66886C0.308848 3.78942 0.472361 3.85715 0.642857 3.85715H17.3571C17.5276 3.85715 17.6912 3.78942 17.8117 3.66886C17.9323 3.5483 18 3.38479 18 3.21429V1.92858C18 1.75808 17.9323 1.59457 17.8117 1.47401C17.6912 1.35345 17.5276 1.28572 17.3571 1.28572Z"
                      fill="#A5E1FF"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <Comment />
        </div>
      </div>
    </div>
  );
};

export default FeedItem;
