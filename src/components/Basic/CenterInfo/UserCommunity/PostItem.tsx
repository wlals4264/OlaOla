import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostFromDB, getImageByPostId } from '../../../../utils/indexedDB';
import Spinner from '../../../Spinner/Spinner';
import { levelOptions } from '../../../../datas/levelOptions';
import { PostCategory } from '../../../Types/postCategory';

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
  const [likeCount, setLikeCount] = useState<number>('');
  const [viewCount, setViewCount] = useState<number>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [userUID, setUserUID] = useState<string>('');
  const levelColor = levelOptions.find((option) => option.value === level)?.color || 'white';

  const isMyPost = userUID === localStorage.getItem('userUID') ? true : false;

  const navigate = useNavigate();

  console.log('게시글 ID:', postId);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    // 비동기 함수 정의
    const fetchPost = async () => {
      try {
        const postData = await getPostFromDB(Number(postId));
        setPost(postData);
        let updatedContent = postData.content;
        setContent(updatedContent);

        const { userUID, createdAt, userNickName, postTitle, centerName, level, postCategory, likeCount, viewCount } =
          postData;

        setCreatedAt(createdAt);
        setUserNickName(userNickName);
        setPostTitle(postTitle);
        setCenterName(centerName);
        setLevel(level);
        setPostCategory(postCategory);
        setLikeCount(likeCount);
        setViewCount(viewCount);
        setUserUID(userUID);

        const processImages = async (content: string, postId: number): Promise<string> => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          const imgTags = Array.from(doc.querySelectorAll('img[src^="blob:"]')) as HTMLImageElement[];

          const blobs = (await getImageByPostId(Number(postId))) as Blob[];

          // 이미지 태그에 Blob URL 적용
          imgTags.forEach((img, index) => {
            if (blobs[index]) {
              const newBlobUrl = URL.createObjectURL(blobs[index]);
              img.setAttribute('src', newBlobUrl);
            }
          });

          return doc.body.innerHTML;
        };

        updatedContent = await processImages(updatedContent, Number(postId));
        setContent(updatedContent);
      } catch (error) {
        console.error('게시글을 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchPost();
  }, [postId]);

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

  const handleOpenModifyComponent = () => {
    navigate('modify-post', { state: { post, postId } });
  };

  return (
    <div className="font-noto w-[760px] flex flex-col justify-center m-auto mb-4">
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
          <h1 className="font-extrabold text-4xl mt-4">{postTitle}</h1>
        </div>
        <div className="my-6 flex justify-between items-center gap-1">
          <div>
            <span className="font-semibold text-sm">{userNickName}</span>
            <span>·</span>
            <span className="text-gray-600 text-sm">{formatDate(createdAt)}</span>
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
                <button type="button" className="text-gray-600 text-sm">
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex mt-4 items-center">
          <span className="text-xs w-fit h-fit py-1 px-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-500 hover:text-white cursor-pointer">
            # {centerName}
          </span>
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
      <form
        className="w-full mt-10"
        // onSubmit={handleCommentSubmit}
      >
        <textarea
          // onChange={handleCommentChange}
          // type="text"
          placeholder="댓글을 남겨주세요!"
          // value={comment}
          className="w-full h-20 px-4 py-3 rounded-xl text-sm outline-none resize-none border-gray-100 border-[1px]"></textarea>
        <div className="flex justify-end items-center my-4">
          <button type="submit" className="bg-primary rounded-md px-4 py-1 font-bold text-white">
            댓글 작성
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostItem;
