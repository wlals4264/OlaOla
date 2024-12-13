import React, { useRef, useState, useEffect } from 'react';
import BrowsingFeedComponent from './BrowsingFeedComponent';
import UserCommunity from './CenterInfo/UserCommunity/UserCommunity';
import FindCenter from './CenterInfo/FindCenter/FindCenter';

const ScrollSnap: React.FC = () => {
  const section1Ref = useRef<HTMLDivElement | null>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (window.scrollY > 500) {
      setIsButtonVisible(false);
    } else {
      setIsButtonVisible(true);
    }
  };

  // 스크롤 이벤트 리스너 추가
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollDown = () => {
    if (section1Ref.current) {
      section1Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (window.scrollY === 0) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    section1Ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory">
        {/* TOP 버튼 */}
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 w-12 h-12 rounded-full bg-primary text-white">
          TOP
        </button>

        {/* 스크롤 스냅 진입 버튼 */}
        {isButtonVisible && (
          <div
            className="absolute 
         top-[calc(100vh/3 + 500px)] 
         left-[50%] 
         z-10 
         transform 
         -translate-x-1/2 
         sm:top-[calc(100vh/4 + 500px)] 
         md:top-[calc(100vh/5 + 500px)] 
         lg:top-[calc(100vh/6 + 500px)]">
            <button className="group" type="button" onClick={handleScrollDown}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.6719 27.5234L8.04687 16.8984C7.3125 16.1641 7.3125 14.9766 8.04687 14.25L9.8125 12.4844C10.5469 11.75 11.7344 11.75 12.4609 12.4844L19.9922 20.0156L27.5234 12.4844C28.2578 11.75 29.4453 11.75 30.1719 12.4844L31.9375 14.25C32.6719 14.9844 32.6719 16.1719 31.9375 16.8984L21.3125 27.5234C20.5938 28.2578 19.4063 28.2578 18.6719 27.5234Z"
                  fill="black"
                  className="fill-black group-hover:fill-[#A5E1FF]"
                />
              </svg>
            </button>
          </div>
        )}

        {/* 스크롤 컨텐츠들 */}
        <div ref={section1Ref} className="w-full h-screen snap-start flex justify-center items-center ">
          <BrowsingFeedComponent isScrollSnap={true} />
        </div>
        <div className="w-full h-screen snap-start flex justify-center ">
          <UserCommunity isScrollSnap={true} />
        </div>
        <div className="w-full h-screen snap-start flex justify-center items-center">
          <FindCenter isScrollSnap={true} />
        </div>
      </div>
    </>
  );
};

export default ScrollSnap;
