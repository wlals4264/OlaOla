import { useState, useEffect } from 'react';
interface LocalImage {
  id: number;
  order: number;
  url: string;
}

// 로컬 이미지 리스트
const localImages: LocalImage[] = [
  { id: 1, order: 0, url: '/assets/images/climb1.jpg' },
  { id: 2, order: 1, url: '/assets/images/climb2.jpg' },
  { id: 3, order: 2, url: '/assets/images/climb3.jpg' },
];

export default function Carousel() {
  const imageList = { images: localImages, index: 0 };
  const [current, setCurrent] = useState(imageList.index);
  const [autoPlay, setAutoPlay] = useState(true);

  const moveStyle: { [key: number]: string } = {
    0: 'translate-x-0',
    1: 'translate-x-[-100vw]',
    2: 'translate-x-[-200vw]',
  };

  const nextHandler = () => {
    setCurrent(() => {
      if (current === imageList.images.length - 1) {
        return 0;
      } else {
        return current + 1;
      }
    });
  };

  const prevHandler = () => {
    setCurrent(() => {
      if (current === 0) {
        return imageList.images.length - 1;
      } else {
        return current - 1;
      }
    });
  };

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(nextHandler, 3000);
    return () => clearInterval(interval);
  }, [autoPlay, current]);

  return (
    <div
      className="relative flex items-center h-[calc(100vw/1.5)] sm:h-[calc(100vw/1.8)] md:h-[calc(100vw/2)] lg:h-[500px] overflow-hidden bg-black"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}>
      {/* Slider Images Render */}
      <div className={`flex h-full items-center ${moveStyle[current]} transition duration-700 ease-in-out`}>
        {imageList.images.map((image) => (
          <div key={image.id} className="w-[100vw]">
            <img src={image.url} alt={`Climbing image ${image.id}`} className="w-full object-contain" />
          </div>
        ))}
      </div>

      {/* 왼쪽 버튼 */}
      <button
        onClick={prevHandler}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.79785 11.6699L14.4385 5.0293C14.8975 4.57031 15.6397 4.57031 16.0938 5.0293L17.1973 6.13281C17.6563 6.5918 17.6563 7.33398 17.1973 7.78809L12.4951 12.5L17.2022 17.207C17.6611 17.666 17.6611 18.4082 17.2022 18.8623L16.0986 19.9707C15.6397 20.4297 14.8975 20.4297 14.4434 19.9707L7.80274 13.3301C7.33887 12.8711 7.33887 12.1289 7.79785 11.6699Z"
            fill="black"
          />
        </svg>
      </button>

      {/* 오른쪽 버튼 */}
      <button
        onClick={nextHandler}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.2021 13.3301L10.5615 19.9707C10.1025 20.4297 9.36035 20.4297 8.90625 19.9707L7.80273 18.8672C7.34375 18.4082 7.34375 17.666 7.80273 17.2119L12.5098 12.5049L7.80273 7.79785C7.34375 7.33887 7.34375 6.59668 7.80273 6.14258L8.90137 5.0293C9.36035 4.57031 10.1025 4.57031 10.5566 5.0293L17.1973 11.6699C17.6611 12.1289 17.6611 12.8711 17.2021 13.3301Z"
            fill="black"
          />
        </svg>
      </button>

      {/* 슬라이드 네비게이션 */}
      <ul className="absolute bottom-5 flex w-full justify-center gap-2">
        {imageList.images.map((_, idx) => (
          <li
            key={idx}
            className={`h-[0.6rem] w-[0.6rem] rounded-full bg-neutral-800 ${idx === current ? 'bg-slate-100' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </ul>
    </div>
  );
}
