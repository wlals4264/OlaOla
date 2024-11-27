import React, { useState, useEffect } from 'react';
import { getDB, getFileListFromDB } from '../../../utils/indexedDB';
import { useRecoilValue } from 'recoil';
import { userUIDState } from '../../../datas/recoilData';
import Spinner from '../../Spinner/Spinner';
import Modal from '../../Modal/Modal';
import FeedItem from './FeedItem'; // FeedItem 컴포넌트가 여기에서 사용된다고 가정

const FeedList: React.FC = () => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const userUID = useRecoilValue(userUIDState);
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isFeedItemModalOpen, setFeedItemModalOpen] = useState<boolean>(false); // 모달 열기/닫기 상태
  const [selectedFeedItem, setSelectedFeedItem] = useState<any | null>(null); // 선택된 feed item

  const fetchData = async () => {
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

      const filteredFiles = files.filter((fileData) => fileData.UID === userUID);
      console.log('필터링된 파일들:', filteredFiles);

      if (filteredFiles.length > 0) {
        const fileUrls = filteredFiles.map((fileData: any) => {
          const fileUrl = URL.createObjectURL(fileData.file);
          return { fileUrl, fileType: fileData.type };
        });
        setFeedItems(fileUrls);
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

  const openFeedItem = (item: any) => {
    setSelectedFeedItem(item); // 선택된 Feed Item 설정
    setFeedItemModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setFeedItemModalOpen(false); // 모달 닫기
    setSelectedFeedItem(null); // 선택된 feed item 초기화
  };

  useEffect(() => {
    fetchData();
  }, [db]);

  if (error) {
    return <div className="min-w-2xl m-auto mt-4 text-center font-noto font-bold text-3xl">{error}</div>;
  }

  if (loading) {
    return (
      <div className="min-w-2xl m-auto mt-4">
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
          const { fileUrl, fileType } = item;
          return (
            <div key={index} className="relative w-[210px] h-[280px]">
              {fileType.startsWith('image') ? (
                <img
                  src={fileUrl}
                  alt={`File ${index}`}
                  onClick={() => openFeedItem(item)} // 클릭 시 해당 item으로 모달 열기
                  className="w-full h-full object-cover rounded-2xl m-auto cursor-pointer"
                />
              ) : fileType.startsWith('video') ? (
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  onClick={() => openFeedItem(item)} // 클릭 시 해당 item으로 모달 열기
                  className="absolute top-[50%] left-[50%] w-full h-full object-cover transition-transform -translate-x-1/2 -translate-y-1/2 rounded-2xl p-0 cursor-pointer">
                  <source src={fileUrl} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Unsupported file type</p>
              )}
            </div>
          );
        })
      )}

      {isFeedItemModalOpen && selectedFeedItem && (
        <Modal isOpen={isFeedItemModalOpen} onClose={handleCloseModal}>
          <FeedItem feedItem={selectedFeedItem} /> {/* FeedItem 컴포넌트에 선택된 feedItem 전달 */}
        </Modal>
      )}
    </div>
  );
};

export default FeedList;
