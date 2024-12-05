import React, { useState, useEffect } from 'react';
import CenterHeader from '../CenterHeader';
import Sidebar from '../Sidebar';
import { Link } from 'react-router-dom';
import { getPostListFromDB } from '../../../../utils/indexedDB';
import Spinner from '../../../Spinner/Spinner';

interface PostItem {
  userNickname?: string;
  postTitle?: string;
  createdAt: Date;
  postCategory: string | null;
}

const UserCommunity: React.FC = () => {
  const [postList, setPostList] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (currentPage: number) => {
    if (loading) return;

    setLoading(true);

    try {
      // DB에서 게시글 리스트 가져오기
      const posts = await getPostListFromDB();
      console.log('DB 연결 성공');

      // 받아온 파일 리스트를 id 내림차순으로 정렬해서 최신값부터 정렬
      const sortedPosts = posts.sort((a, b) => b.id - a.id);

      const pageSize = 5;
      const startIndex = (currentPage - 1) * pageSize;
      const pagedPosts = sortedPosts.slice(startIndex, startIndex + pageSize);

      // console.log('현재 페이지:', currentPage, '로딩할 파일들:', pagedPosts);

      if (pagedPosts.length > 0) {
        const postContents = pagedPosts.map((postData: any) => {
          return {
            createdAt: postData.createdAt,
            userNickname: postData.userNickName,
            postTitle: postData.postTitle,
            postCategory: postData.postCategory,
            id: postData.id, // DB id
          };
        });
        setPostList(postContents);
        setTotalPages(Math.ceil(sortedPosts.length / pageSize));
      }
    } catch (error) {
      console.error('파일을 가져오는 도중 오류 발생:', error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <div>
      <CenterHeader />
      <div className="flex m-auto w-[95%]">
        <Sidebar />

        {/* 커뮤니티 컴포넌트 */}
        <div className="w-4/5 flex flex-col gap-4 mt-10 items-center font-noto shrink-0 ">
          {postList.length === 0 ? (
            <div className="flex w-full h-48 items-center justify-center font-bold text-3xl">게시글 없음</div>
          ) : (
            postList.map((item) => {
              const { postCategory, postTitle, userNickname, createdAt, id } = item;

              return (
                <ul className="w-[645px] flex flex-col gap-4 mt-2 items-center" key={id}>
                  <Link to={`/center-info/user-community/post/${id}`}>
                    <li className="w-[645px] bg-white p-4 rounded-xl shadow-sm mb-2 hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center gap-4">
                        {postCategory ? (
                          <span className="text-xs w-fit h-fit py-1 px-2 rounded-2xl bg-primary font-bold text-white">
                            {postCategory}
                          </span>
                        ) : (
                          ''
                        )}
                        <h2 className="text-lg font-semibold">{postTitle}</h2>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <p className="text-xs text-gray-400">{userNickname || '익명'}</p>
                        <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleDateString()}</span>
                      </div>
                    </li>
                  </Link>
                </ul>
              );
            })
          )}

          <div className="flex items-center gap-4 font-noto">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.67493 9.58789L7.98743 4.27539C8.35462 3.9082 8.94837 3.9082 9.31165 4.27539L10.1945 5.1582C10.5616 5.52539 10.5616 6.11914 10.1945 6.48242L6.43274 10.252L10.1984 14.0176C10.5656 14.3848 10.5656 14.9785 10.1984 15.3418L9.31555 16.2285C8.94837 16.5957 8.35462 16.5957 7.99134 16.2285L2.67883 10.916C2.30774 10.5488 2.30774 9.95508 2.67493 9.58789Z"
                  fill="black"
                />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                disabled={i + 1 === currentPage}
                className={i + 1 === currentPage ? 'font-bold' : ''}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.7617 10.6641L8.44922 15.9766C8.08203 16.3437 7.48828 16.3437 7.125 15.9766L6.24219 15.0937C5.875 14.7266 5.875 14.1328 6.24219 13.7695L10.0078 10.0039L6.24219 6.23828C5.875 5.87109 5.875 5.27734 6.24219 4.91406L7.12109 4.02344C7.48828 3.65625 8.08203 3.65625 8.44531 4.02344L13.7578 9.33594C14.1289 9.70313 14.1289 10.2969 13.7617 10.6641Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-center w-full mt-10 font-noto text-sm">
            {/* 필터링 버튼들 */}
            <div className="flex justify-between items-center shrink-0 w-[645px] m-auto">
              <div className="flex gap-3">
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

              {/* 글쓰기 버튼 */}
              <div>
                <Link to="/center-info/user-community/add-post">
                  <button
                    className="w-20 h-8 bg-black text-white flex justify-center items-center rounded-2xl hover:bg-primary"
                    type="button">
                    글쓰기
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* 검색창 */}
          <form className="relative flex items-center w-[645px] h-[40px] border border-gray-300 rounded-xl mt-2">
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
