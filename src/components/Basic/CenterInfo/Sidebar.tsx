import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-[160px] h-screen flex flex-col items-center gap-4 pt-12 font-noto">
      <span className="text-md font-semibold hover:text-primary cursor-pointer">암창 찾기</span>
      <span className="text-md font-semibold hover:text-primary cursor-pointer">뉴셋 소식</span>
      <span className="text-md font-semibold hover:text-primary cursor-pointer">암장 후기</span>
    </div>
  );
};

export default Sidebar;
