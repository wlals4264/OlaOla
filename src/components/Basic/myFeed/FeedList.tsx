import React, { useState, useEffect } from 'react';
import { getDB, getFileListFromDB, getFileFromDB } from '../../../utils/indexedDB';
import { useRecoilValue } from 'recoil';
import { userUIDState } from '../../../datas/recoilData';
import Spinner from '../../Spinner/Spinner';
import Modal from '../../Modal/Modal';
import FeedItem from './FeedItem';

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

      const filteredFiles = files.filter((fileData) => fileData.UID === userUID).sort((a, b) => b.id - a.id);
      console.log('필터링된 파일들:', filteredFiles);

      if (filteredFiles.length > 0) {
        const fileUrls = filteredFiles.map((fileData: any) => {
          const fileUrl = URL.createObjectURL(fileData.file);
          return {
            fileUrl,
            fileType: fileData.type,
            fileID: fileData.id,
            level: fileData.level,
            fileDescribe: fileData.describe,
          };
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

  const openFeedItem = async (item: any) => {
    try {
      // Fetch the selected file by its fileId using the helper function
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

  const handleCloseModal = () => {
    setFeedItemModalOpen(false);
    setSelectedFeedItem(null);
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

      {isFeedItemModalOpen && selectedFeedItem && (
        <Modal isOpen={isFeedItemModalOpen} onClose={handleCloseModal}>
          <FeedItem feedItem={selectedFeedItem} />
        </Modal>
      )}
    </div>
  );
};

export default FeedList;
