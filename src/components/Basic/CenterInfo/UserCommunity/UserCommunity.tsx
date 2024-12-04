import React, { useState, useEffect } from 'react';
import CenterHeader from '../CenterHeader';
import Sidebar from '../Sidebar';
import { Link } from 'react-router-dom';
import { getPostListFromDB } from '../../../../utils/indexedDB';

interface PostItem {
  userNickname?: string;
  postTitle?: string;
  createdAt: Date;
}

const UserCommunity: React.FC = () => {
  const [postList, setPostList] = useState<PostItem[]>([]);
  // const [db, setDb] = useState<IDBDatabase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  // const [pageParams, setPageParams] = useState<number[]>([]);

  const fetchData = async () => {
    if (loading) return; // 로딩 중이면 중단

    setLoading(true);

    try {
      // DB에서 게시글 리스트 가져오기
      const posts = await getPostListFromDB();
      console.log('DB 연결 성공');

      // 받아온 파일 리스트를 id 내림차순으로 정렬해서 최신값부터 정렬
      const sortedPosts = posts.sort((a, b) => b.id - a.id);

      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      const pagedPosts = sortedPosts.slice(startIndex, startIndex + pageSize);

      console.log('현재 페이지:', page, '로딩할 파일들:', pagedPosts);

      if (pagedPosts.length > 0) {
        const postContents = pagedPosts.map((postData: any) => {
          return {
            createdAt: postData.createdAt,
            userNickname: postData.userNickName,
            postTitle: postData.postTitle,
          };
        });
        setPostList((prevPosts) => [...prevPosts, ...postContents]);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('파일을 가져오는 도중 오류 발생:', error.message);
      } else {
        console.error('알 수 없는 오류 발생:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // 페이지가 변경되거나, DB 연결된 경우에 데이터를 요청
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <CenterHeader />
      <div className="flex">
        <Sidebar />
        <div className="w-full flex flex-col gap-4 mt-10 items-center font-noto">
          {postList.length === 0 ? (
            <p className="text-center font-bold text-3xl">게시물 없음</p>
          ) : (
            postList.map((item, index) => {
              const { postTitle, userNickname, createdAt } = item;
              return (
                <div key={index} className="w-[80%] bg-white p-4 rounded-lg shadow-md mb-2">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold">{postTitle}</h2>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <p className="text-xs text-gray-700">{userNickname || '익명'}</p>
                    <span className="text-xs text-gray-500">{new Date(createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}

          <div>{page}</div>
          <div className="w-full mt-10 font-noto text-sm">
            {/* 필터링 버튼들 */}
            <div className="w-full flex justify-between items-center shrink-0 mr-28">
              <div className="flex gap-4 ml-10">
                <button className="shrink-0" type="button">
                  최신순
                </button>
                <button className="shrink-0" type="button">
                  댓글순
                </button>
                <button className="shrink-0" type="button">
                  좋아요순
                </button>
              </div>

              <div>
                <Link to="/center-info/user-community/add-post">
                  <button
                    className="w-20 h-8 mr-10 bg-black text-white flex justify-center items-center rounded-2xl hover:bg-primary"
                    type="button">
                    글쓰기
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* 검색창 */}
          <form className="relative flex items-center w-[80%] h-[40px] border border-gray-300 rounded-xl mt-2">
            <input
              type="text"
              // value={searchText}
              // onChange={handleSearchChange}
              className="w-full h-full px-3 py-[6px] rounded-xl text-sm items-center outline-none focus:ring-2 focus:ring-primary"
              placeholder="검색어를 입력해주세요."
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_8_776)">
                  <path
                    d="M24.6582 21.6162L19.79 16.748C19.5703 16.5283 19.2725 16.4062 18.96 16.4062H18.1641C19.5117 14.6826 20.3125 12.5146 20.3125 10.1562C20.3125 4.5459 15.7666 0 10.1562 0C4.5459 0 0 4.5459 0 10.1562C0 15.7666 4.5459 20.3125 10.1562 20.3125C12.5146 20.3125 14.6826 19.5117 16.4062 18.1641V18.96C16.4062 19.2725 16.5283 19.5703 16.748 19.79L21.6162 24.6582C22.0752 25.1172 22.8174 25.1172 23.2715 24.6582L24.6533 23.2764C25.1123 22.8174 25.1123 22.0752 24.6582 21.6162ZM10.1562 16.4062C6.7041 16.4062 3.90625 13.6133 3.90625 10.1562C3.90625 6.7041 6.69922 3.90625 10.1562 3.90625C13.6084 3.90625 16.4062 6.69922 16.4062 10.1562C16.4062 13.6084 13.6133 16.4062 10.1562 16.4062Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_8_776">
                    <rect width="25" height="25" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserCommunity;
