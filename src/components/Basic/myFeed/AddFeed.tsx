import React, { useState } from 'react';
import ChooseLevel from './ChooseLevel';
import FileUploadButton from './FileUploadButton';
import Buttons from './Buttons';

const AddFeed: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');

  const saveFileImage = (fileBlob: File | null): void => {
    if (fileBlob instanceof Blob) {
      const fileUrl = URL.createObjectURL(fileBlob);
      setSelectedFileUrl(fileUrl);
      setFileType(fileBlob.type.startsWith('image') ? 'image' : 'video');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    saveFileImage(file);
  };

  console.log(selectedFile);

  return (
    <>
      <div className="flex justify-center gap-12 min-w-2xl min-h-dvh m-auto mt-16">
        {/* image & vidoe 업로드 container */}
        <div className="flex flex-col gap-4">
          {selectedFileUrl ? (
            fileType === 'image' ? (
              <div className="w-[300px] h-[400px] bg-gray-200 rounded-2xl flex flex-col gap-3 items-center justify-center">
                <img src={selectedFileUrl} alt="업로드 이미지" className="w-full h-full object-cover rounded-2xl" />
              </div>
            ) : (
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
            <div className="w-[300px] h-[300px] bg-gray-200 rounded-2xl flex flex-col gap-3 items-center justify-center">
              <p className="font-noto text-sm">아래 버튼으로 사진을 업로드해 보세요!</p>
            </div>
          )}

          {/* 파일 업로드 버튼 컴포넌트 사용 */}
          <FileUploadButton onFileChange={handleFileChange} />
        </div>

        {/* form 요소들 */}
        <form className="flex flex-col gap-4 font-noto">
          {/* 내용 */}
          <label htmlFor="describe" className="text-xs">
            내용
          </label>
          <textarea
            id="describe"
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
            placeholder="암장 이름을 태그해주세요."
            className="w-[300px] h-[35px] text-xs border border-gray-300 px-2 rounded-xl"
          />

          {/* 난이도 */}
          <ChooseLevel />
          <Buttons />
        </form>
      </div>
    </>
  );
};

export default AddFeed;
