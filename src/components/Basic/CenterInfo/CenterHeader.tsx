import React from 'react';
import { useLocation } from 'react-router-dom';

const CenterHeader: React.FC = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/center-info':
        return '암장 찾기';
      case '/center-info/new-settings':
        return '뉴셋 소식';
      case '/center-info/center-reviews':
        return '암장 후기';
      default:
        return '암장 정보';
    }
  };

  return (
    <div className="h-[120px] bg-gray-200 flex items-center pl-10 gap-2">
      <span className="font-noto text-2xl font-bold">암장 정보</span>
      <svg
        className="pt-[2px]"
        width="11"
        height="17"
        viewBox="0 0 11 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.5027 9.1686L3.16928 16.502C2.8156 16.8557 2.24219 16.8557 1.88854 16.502L1.03321 15.6467C0.680133 15.2936 0.679454 14.7214 1.0317 14.3675L6.84359 8.52821L1.0317 2.68901C0.679454 2.33509 0.680133 1.76285 1.03321 1.40977L1.88854 0.554448C2.24222 0.200764 2.81563 0.200764 3.16928 0.554448L10.5027 7.88786C10.8564 8.2415 10.8564 8.81492 10.5027 9.1686Z"
          fill="black"
        />
      </svg>

      <span className="font-noto text-2xl font-bold">{getTitle()}</span>
    </div>
  );
};

export default CenterHeader;
