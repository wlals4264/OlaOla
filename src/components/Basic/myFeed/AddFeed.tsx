import React, { useState } from 'react';
import LoginNav from '../LoginNav';

const AddFeed: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 파일 선택 처리 함수
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  // 파일 선택 버튼을 클릭했을 때 실행되는 함수
  const triggerFileInput = () => {
    document.getElementById('fileInput')?.click();
  };

  console.log(selectedFile);

  return (
    <>
      <LoginNav />
      <div className="flex justify-center gap-12 max-w-2xl m-auto mt-16">
        <div
          className="w-[300px] h-[500px] bg-gray-300 rounded-3xl flex flex-col gap-3 items-center justify-center cursor-pointer"
          onClick={triggerFileInput} // div를 클릭하면 파일 입력 트리거
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12.5" cy="12.5" r="12.5" fill="black" />
            <path
              d="M7.37036 13.4087L6.76815 12.8065C6.51316 12.5515 6.51316 12.1392 6.76815 11.8869L12.0389 6.61348C12.2939 6.35849 12.7062 6.35849 12.9585 6.61348L18.2292 11.8842C18.4842 12.1392 18.4842 12.5515 18.2292 12.8038L17.627 13.406C17.3693 13.6637 16.9488 13.6583 16.6965 13.3952L13.5851 10.1291V17.9253C13.5851 18.2861 13.2948 18.5764 12.9341 18.5764H12.066C11.7052 18.5764 11.415 18.2861 11.415 17.9253V10.1291L8.30081 13.3979C8.04853 13.6637 7.62807 13.6691 7.37036 13.4087Z"
              fill="white"
            />
          </svg>
          <p className="font-noto text-sm">사진을 추가해 주세요.</p>
        </div>

        {/* 실제 파일 선택 input (숨김 처리) */}
        <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />

        <div className="flex flex-col gap-4 font-noto">
          <label htmlFor="describe" className="text-xs">
            내용
          </label>
          <input id="describe" type="textarea" placeholder="내용을 입력해주세요." className="" />
          <label htmlFor="centerName" className="text-xs">
            암장
          </label>
          <input
            id="centerName"
            type="text"
            placeholder="암장 이름을 태그해주세요."
            className="w-[300px] h-[20px] text-sm"
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
