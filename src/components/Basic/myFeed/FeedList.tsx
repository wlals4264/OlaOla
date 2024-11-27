import React, { useEffect, useState } from 'react';
import { getDB, getFileListFromDB } from '../../../utils/indexedDB';
import { useRecoilValue } from 'recoil';
import { userUIDState } from '../../../datas/recoilData';
import Spinner from '../../Spinner/Spinner';

const FeedList: React.FC = () => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const userUID = useRecoilValue(userUIDState);

  const [db, setDb] = useState<IDBDatabase | null>(null);

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

      // DB 연결 후 파일 목록을 불러옴
      const files = await getFileListFromDB();
      console.log('DB 연결 성공');

      // UID가 없으면 오류 처리
      if (!userUID) {
        setError('UID가 존재하지 않습니다.');
        return;
      }

      // 사용자 UID에 맞는 파일들만 필터링
      const filteredFiles = files.filter((fileData) => fileData.UID === userUID);
      console.log('필터링된 파일들:', filteredFiles);

      // 필터링된 파일이 있다면 URL 생성
      if (filteredFiles.length > 0) {
        const fileUrls = filteredFiles.map((fileData: any) => {
          const fileUrl = URL.createObjectURL(fileData.file);
          return { fileUrl, fileType: fileData.type };
        });
        setFeedItems(fileUrls);
      } else {
        setError('해당 UID에 해당하는 파일이 없습니다.');
      }
    } catch (error) {
      // 오류가 발생하면 에러 메시지 출력
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

  useEffect(() => {
    // DB 연결 후 데이터 가져오기
    fetchData();
  }, [db]); // db가 변경될 때마다 실행

  // 에러 발생 시 표시
  if (error) {
    return <div className="min-w-2xl m-auto mt-4 text-center text-red-500">{error}</div>;
  }

  // 로딩 중일 때 표시
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
        <p className="font-bols text-3xl">게시물 없음</p>
      ) : (
        feedItems.map((item, index) => {
          const { fileUrl, fileType } = item;
          return (
            <div key={index} className="relative w-[210px] h-[280px]">
              {fileType.startsWith('image') ? (
                <img src={fileUrl} alt={`File ${index}`} className="w-full h-full object-cover rounded-2xl m-auto" />
              ) : fileType.startsWith('video') ? (
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  className="absolute top-[50%] left-[50%] w-full h-full object-cover transition-transform -translate-x-1/2 -translate-y-1/2 rounded-2xl p-0">
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
    </div>
  );
};

export default FeedList;
