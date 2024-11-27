import React, { useEffect, useState } from 'react';
import { getDB, getFileListFromDB } from '../../../utils/indexedDB';
import { useRecoilValue } from 'recoil';
import { userUIDState } from '../../../datas/recoilData';

const FeedList: React.FC = () => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const userUID = useRecoilValue(userUIDState);
  console.log(userUID);

  const fetchData = async () => {
    try {
      setLoading(true);

      // DB에서 파일 목록을 가져옴
      const db = getDB();
      if (!db) {
        setError('DB가 준비되지 않았습니다.');
        return;
      }
      console.log('DB 연결 성공');

      const files = await getFileListFromDB();

      if (!userUID) {
        setError('UID가 존재하지 않습니다.');
        return;
      }

      if (files.length > 0) {
        // userUID와 일치하는 파일만 필터링
        const filteredFiles = files.filter((fileData) => {
          return fileData.UID === userUID;
        });
        console.log('필터링된 파일들:', filteredFiles);

        if (filteredFiles.length > 0) {
          const fileUrls = filteredFiles.map((fileData: any) => {
            const fileUrl = URL.createObjectURL(fileData.file);
            return { fileUrl, fileType: fileData.type };
          });
          setFeedItems(fileUrls);
        } else {
          setError('해당 UID에 해당하는 파일이 없습니다.');
        }
      } else {
        setError('파일이 존재하지 않습니다.');
      }
    } catch (error) {
      setError('파일을 가져오는 데 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect를 사용하여 컴포넌트가 마운트될 때 데이터 불러오기
  useEffect(() => {
    fetchData();

    // cleanup: 컴포넌트가 unmount될 때 한 번만 URL을 해제
    return () => {
      feedItems.forEach((item) => {
        URL.revokeObjectURL(item.fileUrl); // URL 해제
      });
    };
  }, []); // 의존성 배열을 빈 배열로 설정, 한 번만 실행되도록

  // 에러가 있으면 에러 메시지를 렌더링
  if (error) {
    return <div className="min-w-2xl m-auto mt-4 text-center text-red-500">{error}</div>;
  }

  // 로딩 중일 때 로딩 메시지 표시
  if (loading) {
    return <div className="min-w-2xl m-auto mt-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-2xl m-auto mt-4 grid grid-cols-3 gap-4">
      {feedItems.length === 0 ? (
        <p>No feeds available</p>
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
