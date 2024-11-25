// FileUploadButton.tsx
import React from 'react';

interface FileUploadButtonProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileChange }) => {
  return (
    <div className="flex flex-col gap-4">
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
      </label>

      {/* 실제 파일 선택 input (숨김 처리) */}
      <input id="fileInput" type="file" style={{ display: 'none' }} onChange={onFileChange} accept="video/*, image/*" />
    </div>
  );
};

export default FileUploadButton;
