import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-[160px] h-screen flex flex-col items-center gap-4 pt-12 font-noto shrink-0">
      <Link to="/center-info">
        <span className="text-md font-semibold hover:text-primary cursor-pointer">암창 찾기</span>
      </Link>
      <Link to="/center-info/new-settings">
        <span className="text-md font-semibold hover:text-primary cursor-pointer">뉴셋 소식</span>
      </Link>
      <Link to="/center-info/center-reviews">
        <span className="text-md font-semibold hover:text-primary cursor-pointer">암장 후기</span>
      </Link>
    </div>
  );
};

export default Sidebar;
