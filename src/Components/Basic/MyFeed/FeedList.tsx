import React, { useState, useEffect, useRef } from 'react';
import { getDB, getFileListFromDB, getFileFromDB } from '../../../utils/indexedDB';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userUIDState, isFeedItemModalOpenState } from '../../../datas/recoilData';
import Spinner from '../../../components/Spinner/Spinner';
import Modal from '../../../components/Modal/Modal';
import FeedItem from '../../../components/Basic/MyFeed/FeedItem';

interface FeedItem {
  fileUrl: string;
  fileType: string;
  fileID: number;
  level?: string;
  fileDescribe?: string;
  niceCount?: number;
  centerName?: string;
  userUID?: string;
}

const FeedList: React.FC = () => {
  const userUID = useRecoilValue(userUIDState);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [selectedFeedItem, setSelectedFeedItem] = useState<any | null>(null);
  const [isFeedItemModalOpen, setFeedItemModalOpen] = useRecoilState(isFeedItemModalOpenState);
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pageParams, setPageParams] = useState<number[]>([]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 데이터 불러오기
  const fetchData = async (page: number) => {
    // 중복 호출 방지
    if (loading || !hasMore || pageParams.includes(page)) return;

    // 로딩 true로 변환 & error 초기화
    setLoading(true);
    setError(null);

    try {
      // DB에서 파일 리스트 가져오기
      const files = await getFileListFromDB();
      console.log('DB 연결 성공');

      // UID 체크
      if (!userUID) {
        setError('UID가 존재하지 않습니다.');
        return;
      }

      // 받아온 파일리스트에서 UID와 같은 데이터만 필터링 & id 내림차순 정렬해서 최신값부터 정렬
      const filteredFiles = files.filter((fileData) => fileData.userUID === userUID).sort((a, b) => b.id - a.id);

      const pageSize = 6;
      const startIndex = page * pageSize;
      const pagedFiles = filteredFiles.slice(startIndex, startIndex + pageSize);

      // fileUrl 생성
      if (filteredFiles.length > 0) {
        if (pagedFiles.length > 0) {
          const fileUrls = pagedFiles.map((fileData: any) => {
            const fileUrl = URL.createObjectURL(fileData.file);
            return {
              fileUrl,
              fileType: fileData.type,
              fileID: fileData.id,
              level: fileData.level,
              fileDescribe: fileData.describe,
              niceCount: fileData.niceCount || 0,
              centerName: fileData.centerName,
              userUID: fileData.UID,
            };
          });

          setFeedItems((prevItems) => [...prevItems, ...fileUrls]);
          setPageParams((prev) => [...prev, page]);
          setHasMore(pagedFiles.length === pageSize);
          setLoading(false);
        } else {
          setHasMore(false);
          // setError('게시물 없음');
        }
      } else {
        setError('게시물 없음');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('파일을 가져오는 도중 오류 발생:', error.message);
      } else {
        console.error('알 수 없는 오류 발생:', error);
      }
      setError('게시물 없음');
    } finally {
      setLoading(false);
    }
  };

  // OpenFeedItem 함수
  const openFeedItem = async (item: any) => {
    try {
      const file = await getFileFromDB(item.fileID);
      console.log(file);
      if (file) {
        setSelectedFeedItem(file);
        setFeedItemModalOpen(true);
        console.log(selectedFeedItem);
      } else {
        setError('게시물 없음');
      }
    } catch (error) {
      console.error('파일을 가져오는 도중 오류 발생:', error);
      setError('게시물 없음');
    } finally {
      setLoading(false);
    }
  };

  // Modal에 전달한 close handler 함수
  const handleCloseModal = () => {
    setFeedItemModalOpen(false);
    setSelectedFeedItem(null);
  };

  // 옵저버 생성
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 로딩 중이 아니고 추가 데이터가 있고, 화면에 로더가 보일 때만 실행
        if (entries[0].isIntersecting && !loading && hasMore) {
          // 페이지 업데이트를 방지하기 위해 타이머를 활용
          setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
          }, 200); // 200ms 딜레이
        }
      },
      { rootMargin: '200px' } // rootMargin을 적절히 설정
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore, loaderRef.current]);

  // page와 db 상태 변화에 따른 데이터 요청
  useEffect(() => {
    const initializeDB = async () => {
      try {
        const openedDb = await getDB();
        if (openedDb) {
          setDb(openedDb);

          // 초기화
          setPage(0); // 페이지 초기화
          setFeedItems([]); // 피드 아이템 초기화
          setPageParams([]); // 페이지 파라미터 초기화
          setHasMore(true); // 추가 로드 가능 상태 초기화
        } else {
          setError('게시물 없음');
        }
      } catch (error) {
        setError('게시물 없음');
      }
    };

    // DB 초기화 및 데이터 요청
    if (!db) {
      initializeDB();
    }
  }, [db]);

  useEffect(() => {
    // 페이지와 초기화 상태 확인 후 데이터 요청
    if (db && !pageParams.includes(page)) {
      fetchData(page);
    }
  }, [db, page]);

  // 에러처리
  if (error) {
    return <div className="min-w-2xl m-auto mt-4 text-center font-noto font-bold text-3xl">{error}</div>;
  }

  // 로딩 보여주기
  if (loading && feedItems.length === 0) {
    return (
      <div className="min-w-2xl m-auto mt-4 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl m-auto mt-4 grid grid-cols-3 gap-4 font-noto grid-flow-dense">
      {feedItems.length === 0 ? (
        <p className="text-center font-bold text-3xl">게시물 없음</p>
      ) : (
        feedItems.map((item, index) => {
          const { fileUrl, fileType } = item;
          return (
            <div key={index} className="relative w-[210px] h-[280px] overflow-hidden rounded-2xl group">
              {fileType.startsWith('image') ? (
                <img
                  src={fileUrl}
                  alt={'피드 이미지'}
                  onClick={() => openFeedItem(item)}
                  className="w-full h-full object-cover rounded-2xl m-auto cursor-pointer transition-transform duration-300 group-hover:scale-105 group-hover:brightness-75"
                />
              ) : fileType.startsWith('video') ? (
                <video
                  src={fileUrl}
                  autoPlay
                  muted
                  loop
                  onClick={() => openFeedItem(item)}
                  className="absolute top-[50%] left-[50%] w-full h-full object-cover transition-transform duration-300 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-0 cursor-pointer group-hover:scale-105 group-hover:brightness-75">
                  해당 비디오 타입을 지원하지 않습니다.
                </video>
              ) : (
                <p>지원하지 않는 형식입니다.</p>
              )}
            </div>
          );
        })
      )}

      {loading && <Spinner />}
      <div ref={loaderRef} style={{ height: '10px' }}></div>

      {isFeedItemModalOpen && selectedFeedItem && (
        <Modal isOpen={isFeedItemModalOpen} onClose={handleCloseModal}>
          <FeedItem feedItem={selectedFeedItem} />
        </Modal>
      )}
    </div>
  );
};

export default FeedList;
