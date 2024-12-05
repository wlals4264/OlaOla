import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostFromDB, getImageByPostId } from '../../../../utils/indexedDB';
import Spinner from '../../../Spinner/Spinner';

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

        const { createdAt, userNickName, postTitle, centerName, level, postCategory, likeCount, viewCount } = postData;

        setCreatedAt(createdAt);
        setUserNickName(userNickName);
        setPostTitle(postTitle);
        setCenterName(centerName);
        setLevel(level);
        setPostCategory(postCategory);
        setLikeCount(likeCount);
        setViewCount(viewCount);

        const processImages = async (content: string, postId: number): Promise<string> => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          const imgTags = Array.from(doc.querySelectorAll('img[src^="blob:"]')) as HTMLImageElement[];

          const blobs = (await getImageByPostId(Number(postId))) as Blob[]; // Blob 배열 가져오기

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

  return (
    <div className="font-noto w-[760px] flex flex-col justify-center m-auto mb-4">
      <div className="">
        <div className="flex mt-10 items-center">
          <span className="text-xs w-fit h-fit py-1 px-2 rounded-2xl bg-primary font-semibold text-white cursor-default">
            {postCategory}
          </span>
        </div>
        <h1 className="font-extrabold text-4xl mt-4">{postTitle}</h1>
        <div className="my-6 flex items-center gap-1">
          <span className="font-semibold text-sm">{userNickName}</span>
          <span>·</span>
          <span className="text-gray-800 text-sm">{formatDate(createdAt)}</span>
        </div>
        <div className="flex mt-4 items-center">
          <span className="text-xs w-fit h-fit py-1 px-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-500 hover:text-white cursor-pointer">
            # {centerName}
          </span>
        </div>
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
          type="text"
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
