import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChooseLevel from '../MyFeed/AddFeed/ChooseLevel';
import Buttons from '../Buttons';
import { updateFileInDB } from '../../../utils/indexedDB';

const ModifyFeed: React.FC = () => {
  const location = useLocation();
  const { feedItem, fileUrl: initialFileUrl } = location.state;

  const [centerName, setCenterName] = useState<string>(feedItem.centerName);
  const [fileDescribe, setFileDescribe] = useState<string>(feedItem.describe);
  const [fileUrl, setFileUrl] = useState<string>(initialFileUrl || ''); // fileUrl 초기화
  const [climbingLevel, setClimbingLevel] = useState<string>(feedItem.level);

  // 이미지 Blob Url 생성
  useEffect(() => {
    if (feedItem.file) {
      const newFileUrl = URL.createObjectURL(feedItem.file); // file이 null이 아니면 URL 생성
      setFileUrl(newFileUrl);

      // 컴포넌트 언마운트 시 Blob URL 해제
      return () => {
        URL.revokeObjectURL(newFileUrl);
      };
    }
  }, [feedItem.file]);

  // 난이도 변경 시 상태 업데이트 함수
  const handleClimbingLevelChange = (newClimbingLevel: string) => {
    setClimbingLevel(newClimbingLevel);
  };

  // DB 수정 함수 호출
  const handleUpdate = async () => {
    const updatedData = {
      niceCount: feedItem.niceCount,
      describe: fileDescribe,
      level: climbingLevel,
      centerName: centerName,
    };

    try {
      await updateFileInDB(feedItem.id, updatedData);
      console.log('파일이 성공적으로 수정되었습니다!');
    } catch (error) {
      console.log('파일 수정 실패: ' + error);
    }
  };

  return (
    <>
      <div className="flex justify-center gap-12 min-w-2xl min-h-dvh m-auto mt-16">
        {/* image & video 업로드 container */}
        <div className="flex flex-col gap-4">
          {feedItem.type === 'image' ? (
            <div className="w-[300px] h-[400px] bg-gray-200 rounded-2xl flex flex-col gap-3 items-center justify-center">
              <img src={fileUrl} alt="업로드 이미지" className="w-full h-full object-cover rounded-2xl" />
            </div>
          ) : feedItem.type === 'video' ? (
            <div className="relative min-w-[300px] min-h-[400px] bg-gray-200 rounded-2xl flex flex-col gap-3 items-center justify-center">
              <video
                src={fileUrl}
                controls
                muted
                autoPlay
                loop
                className="absolute top-[50%] left-[50%] w-full h-full object-cover transition-transform -translate-x-1/2 -translate-y-1/2 rounded-2xl p-0"
              />
            </div>
          ) : (
            <div className="w-[300px] h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center">
              <p className="text-xs text-gray-500">파일 미리보기 없음</p>
            </div>
          )}
        </div>

        {/* form 요소들 */}
        <form className="flex flex-col gap-4 font-noto">
          {/* 내용 */}
          <label htmlFor="describe" className="text-xs">
            내용
          </label>
          <textarea
            id="describe"
            defaultValue={fileDescribe}
            onChange={(e) => setFileDescribe(e.target.value)}
            placeholder="내용을 입력해주세요."
            className="w-[300px] h-[180px] text-xs border border-gray-300 p-2 rounded-xl"
          />

          {/* 암장명 태그 */}
          <label htmlFor="centerName" className="text-xs">
            암장명
          </label>
          <input
            id="centerName"
            type="text"
            defaultValue={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            placeholder="암장 이름을 태그해주세요."
            className="w-[300px] h-[35px] text-xs border border-gray-300 px-2 rounded-xl"
          />

          {/* 난이도 */}
          <ChooseLevel currentClimbingLevel={climbingLevel} onClimbingLevelChange={handleClimbingLevelChange} />

          <Buttons
            updateFileInDB={handleUpdate}
            selectedFile={feedItem.file}
            selectedFileUrl={fileUrl}
            fileType={feedItem.fileType}
            describe={fileDescribe}
            centerName={centerName}
          />
        </form>
      </div>
    </>
  );
};

export default ModifyFeed;
