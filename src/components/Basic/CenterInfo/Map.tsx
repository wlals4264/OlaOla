import React, { useEffect, useRef, useState } from 'react';

interface MapProps {
  searchText: string;
  showSearchResults: boolean;
}

const Map: React.FC<MapProps> = ({ searchText, showSearchResults }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { kakao } = window as any;

  // 마커와 오버레이를 관리하는 ref
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const customOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  // 상태 추가: 검색된 장소의 정보
  const [placeInfo, setPlaceInfo] = useState({
    placeName: '',
    placeUrl: '',
    address: '',
    phoneNumber: '',
    category_name: '',
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (kakao && mapContainerRef.current) {
      const mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };

      const map = new kakao.maps.Map(mapContainerRef.current, mapOption);
      map.setZoomable(false);

      if (showSearchResults && searchText) {
        const places = new kakao.maps.services.Places();
        places.keywordSearch(searchText, (data, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const place = data[0];

            // "클라이밍"이 카테고리 이름에 포함되어 있는지 체크
            if (place.category_name && place.category_name.includes('클라이밍')) {
              console.log(place);

              // 검색 결과를 바탕으로 맵 렌더링
              const latlng = new kakao.maps.LatLng(place.y, place.x);
              map.setCenter(latlng);

              // 장소 정보 상태 업데이트
              setPlaceInfo({
                placeName: place.place_name,
                placeUrl: place.place_url,
                address: place.address_name,
                phoneNumber: place.phone || '정보 없음',
                category_name: place.category_name,
                lat: place.y,
                lng: place.x,
              });

              // 기존 마커가 있으면 삭제
              if (markerRef.current) {
                markerRef.current.setMap(null);
              }

              // 새로운 마커 생성
              markerRef.current = new kakao.maps.Marker({
                map,
                position: latlng,
                title: place.place_name,
              });

              // 기존 오버레이가 있으면 삭제
              if (customOverlayRef.current) {
                customOverlayRef.current.setMap(null);
              }

              const customOverlayContent =
                '<div class="px-2 py-1 w-auto h-auto bg-white border-primary border-2 rounded-xl justify-center items-center">' +
                `  <a class="flex w-full gap-1 justify-center items-center" href=${place.place_url} target="_blank">` +
                `    <span class="font-noto font-semibold text-xs">${place.place_name}</span>` +
                `<div class="w-full h-full mt-[1px]"><svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.60882 5.61683L2.20875 10.0169C1.99654 10.2291 1.6525 10.2291 1.44031 10.0169L0.927112 9.50369C0.715264 9.29184 0.714856 8.94849 0.926207 8.73615L4.41334 5.2326L0.926207 1.72908C0.714856 1.51673 0.715264 1.17339 0.927112 0.961537L1.44031 0.448342C1.65252 0.236132 1.99656 0.236132 2.20875 0.448342L6.6088 4.84839C6.82101 5.06058 6.82101 5.40462 6.60882 5.61683Z" fill="black"/>
                </svg></div>` +
                '</a>' +
                '</div>';

              const customOverlayPosition = new kakao.maps.LatLng(place.y, place.x);

              // 새로운 오버레이 생성
              customOverlayRef.current = new kakao.maps.CustomOverlay({
                map,
                position: customOverlayPosition,
                content: customOverlayContent,
                yAnchor: 2.5,
              });
            }
          }
        });
      }
    }
  }, [searchText, showSearchResults, kakao]);

  return (
    <div className="flex flex-col gap-10">
      <div ref={mapContainerRef} className="w-[500px] h-[400px] bg-gray-300"></div>
      <div className="font-noto">
        <div className="flex">
          <span className="w-20 font-semibold text-md mb-4">암장명</span>
          <span>{placeInfo.placeName}</span>
        </div>
        <div className="flex">
          <span className="w-20 font-semibold text-md mb-4">주소</span>
          <span>{placeInfo.address}</span>
        </div>
        <div className="flex">
          <span className="w-20 font-semibold text-md mb-4">전화번호</span>
          <span>{placeInfo.phoneNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default Map;
