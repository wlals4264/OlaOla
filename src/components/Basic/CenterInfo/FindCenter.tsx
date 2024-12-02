import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Map from './Map';

interface MapProps {
  searchText: string;
  showSearchResults: boolean;
}
const FindCenter: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 검색어를 이용한 카카오 맵 링크 생성
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchResults(true);
  };

  return (
    <div>
      <div className="flex">
        <Sidebar />

        {/* 암장 찾기 컴포넌트  */}
        <div className="w-full flex flex-col gap-10 mt-10 items-center">
          {/* 검색창 */}
          <form
            className="relative flex items-center w-[360px] h-[40px] border border-gray-300 rounded-xl mt-2"
            onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              className="w-full h-full px-3 py-[6px] rounded-xl text-xs items-center outline-none focus:ring-2 focus:ring-primary"
              placeholder="찾고 싶은 암장 이름을 입력해주세요 (ex 더클라임)"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_8_776)">
                  <path
                    d="M24.6582 21.6162L19.79 16.748C19.5703 16.5283 19.2725 16.4062 18.96 16.4062H18.1641C19.5117 14.6826 20.3125 12.5146 20.3125 10.1562C20.3125 4.5459 15.7666 0 10.1562 0C4.5459 0 0 4.5459 0 10.1562C0 15.7666 4.5459 20.3125 10.1562 20.3125C12.5146 20.3125 14.6826 19.5117 16.4062 18.1641V18.96C16.4062 19.2725 16.5283 19.5703 16.748 19.79L21.6162 24.6582C22.0752 25.1172 22.8174 25.1172 23.2715 24.6582L24.6533 23.2764C25.1123 22.8174 25.1123 22.0752 24.6582 21.6162ZM10.1562 16.4062C6.7041 16.4062 3.90625 13.6133 3.90625 10.1562C3.90625 6.7041 6.69922 3.90625 10.1562 3.90625C13.6084 3.90625 16.4062 6.69922 16.4062 10.1562C16.4062 13.6084 13.6133 16.4062 10.1562 16.4062Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_8_776">
                    <rect width="25" height="25" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </form>
          {/* 지도맵 & 세부 정보 */}
          <div className="flex">
            {/* <div className="w-[500px] h-[400px] bg-gray-300"></div> */}
            <Map searchText={searchText} showSearchResults={showSearchResults} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindCenter;
