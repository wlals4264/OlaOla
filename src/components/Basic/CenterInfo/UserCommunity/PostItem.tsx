import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostFromDB, getImageByPostId } from '../../../../utils/indexedDB';
import Spinner from '../../../Spinner/Spinner';

const PostItem: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  console.log('게시글 ID:', postId);

  useEffect(() => {
    // 비동기 함수 정의
    const fetchPost = async () => {
      try {
        const postData = await getPostFromDB(Number(postId));
        setPost(postData);

        let updatedContent = postData.content;

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
      <div className="flex justify-center items-center">
        <Spinner />;
      </div>
    );
  }

  // 게시글 데이터가 없을 경우 처리
  if (!post) {
    return <div className="font-noto font-bold text-center text-3xl mt-20">게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>게시글 ID: {postId}</h1>
      {/* 실제 게시글 내용은 여기에서 로드하여 표시 */}
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
  );
};

export default PostItem;
