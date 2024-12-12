declare namespace kakao {
  namespace maps {
    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      setZoomable(zoomable: boolean): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
    }

    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
    }

    namespace services {
      class Places {
        keywordSearch(keyword: string, callback: (result: Place[], status: Status) => void): void;
      }

      interface Place {
        place_name: string;
        place_url: string;
        address_name: string;
        phone?: string;
        category_name?: string;
        x: number; // 경도
        y: number; // 위도
      }

      enum Status {
        OK = 'OK',
        ZERO_RESULT = 'ZERO_RESULT',
        ERROR = 'ERROR',
      }
    }
  }
}

interface MapOptions {
  center: kakao.maps.LatLng;
  level: number;
}

interface MarkerOptions {
  map: kakao.maps.Map;
  position: kakao.maps.LatLng;
  title?: string;
}

interface CustomOverlayOptions {
  map: kakao.maps.Map;
  position: kakao.maps.LatLng;
  content: string | HTMLElement;
  yAnchor?: number;
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}
