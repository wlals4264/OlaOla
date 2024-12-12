import React, { useEffect, useState } from 'react';
import ChooseLevel from './ChooseLevel';
import FileUploadButton from './FileUploadButton';
import Buttons from '../Buttons';

const AddFeed: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [describe, setDescribe] = useState<string>('');
  const [centerName, setCenterName] = useState<string>('');
  const [currentClimbingLevel, setCurrentClimbingLevel] = useState<string>('');

  // 업로드된 파일 URL 생성 & 파일 타입(image/video) 설정
  const saveFileImage = (fileBlob: File | null): void => {
    if (fileBlob instanceof Blob) {
      const fileUrl = URL.createObjectURL(fileBlob);
      setSelectedFileUrl(fileUrl);
      setFileType(fileBlob.type.startsWith('image') ? 'image' : 'video');
    }
  };

  // 컴포넌트 언마운트 시 생성된 URL 해제
  useEffect(() => {
    return () => {
      if (selectedFileUrl) {
        URL.revokeObjectURL(selectedFileUrl);
      }
    };
  }, [selectedFileUrl]);

  // 파일 변경 이벤트 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    saveFileImage(file);
  };

  // ChooseLevel의 onClimbingLevelChange 핸들러
  const handleClimbingLevelChange = (newClimbingLevel: string): void => {
    setCurrentClimbingLevel(newClimbingLevel);
  };

  return (
    <>
      <div className="flex justify-center items-center gap-12 min-w-2xl min-h-screen m-auto ">
        {/* image & video 업로드 container */}
        <div className="flex flex-col gap-4">
          {selectedFileUrl ? (
            // 이미지 미리보기
            fileType === 'image' ? (
              <div className="w-[300px] h-[400px] bg-gray-200 rounded-2xl flex flex-col gap-3 items-center justify-center">
                <img src={selectedFileUrl} alt="업로드 이미지" className="w-full h-full object-cover rounded-2xl" />
              </div>
            ) : (
              // 비디오 미리보기
              <div className="relative min-w-[300px] min-h-[400px] bg-gray-200 rounded-2xl flex flex-col gap-3 items-center justify-center">
                <video
                  src={selectedFileUrl}
                  controls
                  muted
                  autoPlay
                  loop
                  className="absolute top-[50%] left-[50%] w-full h-full object-cover transition-transform -translate-x-1/2 -translate-y-1/2 rounded-2xl p-0"
                />
              </div>
            )
          ) : (
            <div className="w-[300px] h-[400px] bg-gray-200 rounded-2xl flex flex-col gap-3 items-center justify-center">
              <p className="font-noto text-sm">아래 버튼으로 사진을 업로드해 보세요!</p>
            </div>
          )}

          {/* 파일 업로드 버튼 컴포넌트 사용 */}
          <FileUploadButton onFileChange={handleFileChange} />
        </div>

        {/* form 요소들 */}
        <form className="flex flex-col gap-3 font-noto mt-0">
          {/* 내용 */}
          <label htmlFor="describe" className="text-xs">
            내용
          </label>
          <textarea
            id="describe"
            onChange={(e) => setDescribe(e.target.value)}
            placeholder="내용을 입력해주세요."
            className="w-[300px] h-[180px] text-xs border border-gray-300 p-2 rounded-xl"
          />

          {/* 암장명 태그 */}
          <label htmlFor="centerName" className="text-xs">
            암장
          </label>
          <input
            id="centerName"
            type="text"
            onChange={(e) => setCenterName(e.target.value)}
            placeholder="암장 이름을 태그해주세요."
            className="w-[300px] h-[35px] text-xs border border-gray-300 px-2 rounded-xl"
          />

          {/* 난이도 */}
          <ChooseLevel
            currentClimbingLevel={currentClimbingLevel} // 빈 값으로 전달
            onClimbingLevelChange={handleClimbingLevelChange} // 상태 변경 핸들러 전달
          />
          {/* Buttons 컴포넌트에 파일 정보 전달 */}
          <Buttons
            selectedFile={selectedFile}
            selectedFileUrl={selectedFileUrl}
            fileType={fileType}
            describe={describe}
            centerName={centerName}
          />
        </form>
      </div>
    </>
  );
};

export default AddFeed;
