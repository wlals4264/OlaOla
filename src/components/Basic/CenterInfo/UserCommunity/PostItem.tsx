import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  getPostFromDB,
  deletePostInDB,
  updatePostInDB,
  deleteImageInDB,
  deleteCommentInDB,
} from '../../../../utils/indexedDB';
import Spinner from '../../../Spinner/Spinner';
import { levelOptions } from '../../../../datas/levelOptions';
import { isLoginUserState, userUIDState } from '../../../../datas/recoilData';
import { PostCategory } from '../../../Types/PostCategory';
import CommunityComment from './CommunityComment';

const PostItem: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [userNickName, setUserNickName] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const [centerName, setCenterName] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [postCategory, setPostCategory] = useState<string | null>('');
  const [likeCount, setLikeCount] = useState<number>(0);
  const [likeUser, setLikeUser] = useState<string[]>([]);
  const [viewCount, setViewCount] = useState<number>(0);
  const [createdAt, setCreatedAt] = useState<string>('');

  // 로그인 상태와 userUID 가져오기
  const isLogin = useRecoilValue(isLoginUserState);
  const userUID = useRecoilValue(userUIDState);

  const [postUserUId, setPostUserUID] = useState<string | null>('');
  const [hasClicked, setHasClicked] = useState(false);

  const levelColor = levelOptions.find((option) => option.value === level)?.color || 'white';

  const isMyPost = postUserUId === userUID ? true : false;

  const navigate = useNavigate();

  // postId에 따라 postData 요청
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostFromDB(Number(postId));
        setPost(postData);
        console.log(postData);

        let updatedContent = postData.content;
        setContent(updatedContent);

        // 받아온 데이터를 통해 게시글에 필요한 상태 저장
        const {
          userUID,
          createdAt,
          userNickName,
          postTitle,
          centerName,
          level,
          postCategory,
          likeCount,
          likeUser,
          viewCount,
        } = postData;
        setCreatedAt(createdAt);
        setUserNickName(userNickName);
        setPostTitle(postTitle);
        setCenterName(centerName);
        setLevel(level);
        setPostCategory(postCategory);
        setLikeCount(likeCount);
        setViewCount(viewCount);
        setPostUserUID(userUID);
        setLikeUser(likeUser);

        setContent(updatedContent);
        setPost({ ...postData, content: updatedContent });
        updatePostInDB(Number(postId), { ...postData, content: updatedContent });
        console.log(updatedContent);
      } catch (error) {
        console.error('게시글을 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (likeUser.includes(userUID as string)) {
      setHasClicked(true);
    } else {
      setHasClicked(false);
    }
  }, [likeUser, userUID]);

  // 로딩 중 처리
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  // 게시글 데이터가 없을 경우 처리
  if (!post) {
    return <div className="font-noto font-bold text-center text-3xl mt-20">게시글을 찾을 수 없습니다.</div>;
  }

  // 게시글 수정하기 버튼 함수
  // modify-post로 props 전달
  const handleOpenModifyComponent = () => {
    navigate('modify-post', { state: { post, postId } });
  };

  // 게시글 삭제 버튼 함수
  const handleDeleteButtonClick = () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      deletePostInDB(Number(postId));
      deleteImageInDB(Number(postId));
      deleteCommentInDB('postCommentData', Number(postId));
      navigate(-1);
    }
  };

  // 날짜 포매팅 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // 좋아요 버튼 핸들러 함수
  const handleLikeButtonClick = () => {
    if (!isLogin || !userUID) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    let updateLikeUser;
    if (likeUser && likeUser.includes(userUID)) {
      // Remove userUID from the array
      updateLikeUser = likeUser.filter((uid) => uid !== userUID);
      setLikeCount((prevCount) => prevCount - 1);
    } else {
      // Add userUID to the array
      updateLikeUser = [...likeUser, userUID];
      setLikeCount((prevCount) => prevCount + 1);
    }

    setHasClicked(!hasClicked);
    setLikeUser(updateLikeUser);

    // Update in IndexedDB
    updatePostInDB(Number(postId), {
      likeCount: updateLikeUser.length,
      likeUser: updateLikeUser,
    });
  };

  return (
    <div className="font-noto w-[760px] flex flex-col justify-center m-auto mb-4">
      {/* category & title & level & nickName & createAt & 수정, 삭제 buttons */}
      <div className="">
        <div className="flex mt-10 items-center">
          <span className="text-xs w-fit h-fit py-1 px-2 rounded-2xl bg-primary font-semibold text-white cursor-default">
            {postCategory}
          </span>
        </div>
        <div className="flex items-end gap-4">
          {postCategory === PostCategory.NEWSETTING && level && (
            <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M25.2586 35.5514L25.0004 35.3952L24.7418 35.5509L16.096 40.7593L16.0951 40.7598C14.8922 41.4879 13.4199 40.4137 13.7369 39.0508L16.0285 29.2177L16.0969 28.9239L15.8689 28.7263L8.22311 22.1013L8.22293 22.1012C7.16037 21.1813 7.73458 19.4422 9.12283 19.3318L9.12283 19.3318L9.12547 19.3316L19.188 18.4774L19.4881 18.4519L19.6059 18.1747L23.5434 8.90384L23.5442 8.90189C24.081 7.62303 25.9187 7.62303 26.4555 8.90189L26.4561 8.90346L30.3936 18.1951L30.5113 18.4727L30.8117 18.4983L40.8742 19.3524L40.8769 19.3526C42.2651 19.4631 42.8393 21.2022 41.7768 22.122L41.7766 22.1222L34.1308 28.7472L33.9028 28.9447L33.9712 29.2385L36.2628 39.0716C36.2629 39.0717 36.2629 39.0718 36.2629 39.0719C36.5796 40.4347 35.1075 41.5087 33.9046 40.7806L33.9044 40.7805L25.2586 35.5514Z"
                fill={levelColor}
                stroke={levelColor !== 'white' ? '' : '#8C8C8C'}
              />
            </svg>
          )}{' '}
          <div className="w-full flex justify-between items-end">
            {/* title */}
            <h1 className="font-extrabold text-4xl mt-4">{postTitle}</h1>
            {/* 좋아요 버튼 박스 */}
            {!hasClicked ? (
              <button type="button" onClick={handleLikeButtonClick}>
                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.5931 27.2742L15.591 27.2722C11.2691 23.3532 7.80369 20.207 5.40067 17.2691C3.01488 14.3523 1.83334 11.824 1.83334 9.16673C1.83334 4.86182 5.1951 1.50006 9.50001 1.50006C11.9458 1.50006 14.3167 2.64596 15.858 4.4559L17 5.797L18.142 4.4559C19.6833 2.64596 22.0542 1.50006 24.5 1.50006C28.8049 1.50006 32.1667 4.86182 32.1667 9.16673C32.1667 11.824 30.9851 14.3524 28.599 17.2716C26.196 20.2116 22.7309 23.3614 18.4095 27.2885C18.409 27.289 18.4084 27.2895 18.4079 27.29L17.0038 28.5584L15.5931 27.2742Z"
                    stroke="#A5E1FF"
                    stroke-width="3"
                  />
                </svg>
              </button>
            ) : (
              <button type="button" onClick={handleLikeButtonClick}>
                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17 30.5834L14.5833 28.3834C6.00001 20.6001 0.333344 15.4667 0.333344 9.16673C0.333344 4.03339 4.36668 6.10352e-05 9.50001 6.10352e-05C12.4 6.10352e-05 15.1833 1.35006 17 3.48339C18.8167 1.35006 21.6 6.10352e-05 24.5 6.10352e-05C29.6333 6.10352e-05 33.6667 4.03339 33.6667 9.16673C33.6667 15.4667 28 20.6001 19.4167 28.4001L17 30.5834Z"
                    fill="#A5E1FF"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="my-6 flex justify-between items-center gap-1">
          <div className="flex gap-1 items-center cursor-default">
            <span className="font-semibold text-sm">{userNickName}</span>
            <span> · </span>
            <span className="text-gray-600 text-sm">{formatDate(createdAt)}</span>
            <span> · </span>
            <svg
              className="mt-[2px]"
              width="11"
              height="11"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.2047 9.48207L4.4797 8.82207C1.9047 6.48707 0.204697 4.94707 0.204697 3.05707C0.204697 1.51707 1.4147 0.307068 2.9547 0.307068C3.8247 0.307068 4.6597 0.712068 5.2047 1.35207C5.7497 0.712068 6.5847 0.307068 7.4547 0.307068C8.9947 0.307068 10.2047 1.51707 10.2047 3.05707C10.2047 4.94707 8.5047 6.48707 5.9297 8.82707L5.2047 9.48207Z"
                fill="#4b5563"
              />
            </svg>
            <span className="text-gray-600 text-sm">{likeCount}</span>
          </div>
          <div>
            {isMyPost && (
              // 수정 및 삭제 버튼
              <div className="flex gap-2">
                {/* 수정하기 버튼 */}
                <button onClick={handleOpenModifyComponent} type="button" className="text-gray-600 text-sm">
                  수정
                </button>
                {/* 삭제하기 버튼 */}
                <button onClick={handleDeleteButtonClick} type="button" className="text-gray-600 text-sm">
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex mt-4 items-center">
          {centerName && (
            <span className="text-xs w-fit h-fit py-1 px-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-500 hover:text-white cursor-pointer">
              # {centerName}
            </span>
          )}
        </div>

        {/* 게시글 내용 */}
        <div
          dangerouslySetInnerHTML={{
            __html: content,
          }}
          style={{
            marginTop: '30px',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
          }}
        />
      </div>

      {/* 댓글창 */}
      <CommunityComment postId={Number(postId)} />
    </div>
  );
};

export default PostItem;
