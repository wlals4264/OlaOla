import React, { useEffect, useRef } from 'react';

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { kakao } = window;

  useEffect(() => {
    if (kakao && mapContainerRef.current) {
      const mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3, // 줌 레벨
      };

      new kakao.maps.Map(mapContainerRef.current, mapOption);
    }
  }, []);

  return <div ref={mapContainerRef} className="w-[500px] h-[400px] bg-gray-300"></div>;
};

export default Map;
