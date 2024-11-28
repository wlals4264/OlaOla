import React, { useState, useEffect, useRef } from 'react';
import { getDB, getFileListFromDB, getFileFromDB } from '../../../utils/indexedDB';
import { useRecoilValue } from 'recoil';
import { userUIDState } from '../../../datas/recoilData';
import Spinner from '../../Spinner/Spinner';
import Modal from '../../Modal/Modal';
import FeedItem from './FeedItem';

const FeedList: React.FC = () => {
  const userUID = useRecoilValue(userUIDState);

  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [selectedFeedItem, setSelectedFeedItem] = useState<any | null>(null);
  const [isFeedItemModalOpen, setFeedItemModalOpen] = useState<boolean>(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      if (!db) {
        const openedDb = await getDB();
        if (!openedDb) {
          setError('DB가 준비되지 않았습니다.');
          console.error('DB 연결 실패');
          return;
        }
        setDb(openedDb);
      }

      const files = await getFileListFromDB();
      console.log('DB 연결 성공');

      if (!userUID) {
        setError('UID가 존재하지 않습니다.');
        return;
      }

      const filteredFiles = files.filter((fileData) => fileData.UID === userUID).sort((a, b) => b.id - a.id);
      console.log('필터링된 파일들:', filteredFiles);

      if (filteredFiles.length > 0) {
        const pageSize = 10; // 한 번에 불러올 파일 수
        const startIndex = page * pageSize;
        const pagedFiles = filteredFiles.slice(startIndex, startIndex + pageSize);

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
            };
          });

          setFeedItems((prevItems) => [...prevItems, ...fileUrls]);
          setHasMore(pagedFiles.length === pageSize);
        } else {
          setHasMore(false);
          setError('게시물 없음');
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
      setError('파일을 가져오는 도중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  // OpenFeedItem 함수
  const openFeedItem = async (item: any) => {
    try {
      const file = await getFileFromDB(item.fileID);
      if (file) {
        setSelectedFeedItem({ ...item, file });
        console.log(selectedFeedItem);
        setFeedItemModalOpen(true);
      } else {
        setError('파일을 가져오는 도중 오류 발생');
      }
    } catch (error) {
      console.error('파일을 가져오는 도중 오류 발생:', error);
      setError('파일을 가져오는 도중 오류 발생');
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
        if (entries[0].isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { rootMargin: '200px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading]);

  // page와 db 상태 변화에 따른 데이터 요청
  useEffect(() => {
    fetchData();
  }, [page, db]);

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
    <div className="max-w-2xl m-auto mt-4 grid grid-cols-3 gap-4 font-noto">
      {feedItems.length === 0 ? (
        <p className="text-center font-bold text-3xl">게시물 없음</p>
      ) : (
        feedItems.map((item, index) => {
          const { fileUrl, fileType, fileID } = item;
          return (
            <div key={index} className="relative w-[210px] h-[280px]">
              {fileType.startsWith('image') ? (
                <img
                  src={fileUrl}
                  id={fileID}
                  alt={`File ${index}`}
                  onClick={() => openFeedItem(item)}
                  className="w-full h-full object-cover rounded-2xl m-auto cursor-pointer"
                />
              ) : fileType.startsWith('video') ? (
                <video
                  autoPlay
                  muted
                  loop
                  onClick={() => openFeedItem(item)}
                  className="absolute top-[50%] left-[50%] w-full h-full object-cover transition-transform -translate-x-1/2 -translate-y-1/2 rounded-2xl p-0 cursor-pointer">
                  <source src={fileUrl} />
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
