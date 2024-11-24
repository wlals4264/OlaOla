import React, { useState } from 'react';
import LoginNav from '../LoginNav';

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

  //
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    saveFileImage(file);
  };

  console.log(selectedFile);

  return (
    <>
      <LoginNav />
      <div className="flex justify-center gap-12 min-w-2xl min-h-dvh m-auto mt-16">
        <div className="flex flex-col gap-4">
          <div className="min-w-[300px] h-[300px] bg-gray-200 rounded-2xl flex flex-col gap-3 items-center justify-center">
            {selectedFileUrl ? (
              fileType === 'image' ? (
                <img src={selectedFileUrl} alt="업로드 이미지" className="w-full h-full rounded-2xl" />
              ) : (
                <video src={selectedFileUrl} controls autoPlay loop className="w-full h-full rounded-2xl" />
              )
            ) : (
              <p className="font-noto text-sm">아래 버튼으로 사진을 업로드해 보세요!</p>
            )}
          </div>
          <label
            htmlFor="fileInput"
            className="w-[50px] h-[50px] bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:ring-black hover:ring-1 hover:bg-white">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12.5" cy="12.5" r="12.5" fill="black" />
              <path
                d="M7.37036 13.4087L6.76815 12.8065C6.51316 12.5515 6.51316 12.1392 6.76815 11.8869L12.0389 6.61348C12.2939 6.35849 12.7062 6.35849 12.9585 6.61348L18.2292 11.8842C18.4842 12.1392 18.4842 12.5515 18.2292 12.8038L17.627 13.406C17.3693 13.6637 16.9488 13.6583 16.6965 13.3952L13.5851 10.1291V17.9253C13.5851 18.2861 13.2948 18.5764 12.9341 18.5764H12.066C11.7052 18.5764 11.415 18.2861 11.415 17.9253V10.1291L8.30081 13.3979C8.04853 13.6637 7.62807 13.6691 7.37036 13.4087Z"
                fill="white"
              />
            </svg>
            {/* <p className="font-noto text-sm">사진을 추가해 주세요.</p> */}
          </label>
          {/* 실제 파일 선택 input (숨김 처리) */}

          <input
            id="fileInput"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="video/*, image/*"
          />
        </div>

        <div className="flex flex-col gap-4 font-noto">
          <label htmlFor="describe" className="text-xs">
            내용
          </label>

          <textarea
            id="describe"
            placeholder="내용을 입력해주세요."
            className="w-[300px] h-[180px] text-xs border border-gray-300 p-2 rounded-xl"
          />
          <label htmlFor="centerName" className="text-xs">
            암장
          </label>
          <input
            id="centerName"
            type="text"
            placeholder="암장 이름을 태그해주세요."
            className="w-[300px] h-[35px] text-xs border border-gray-300 px-2 rounded-xl"
          />
          <label htmlFor="level" className="text-xs">
            난이도
          </label>
          {/* <input id="level" type="radio" /> */}
        </div>
      </div>
    </>
  );
};

export default AddFeed;
