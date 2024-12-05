import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostFromDB, getImageFromIndexedDB } from '../../../../utils/indexedDB';
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
        // setContent(postData.content);

        let updatedContent = postData.content;

        const processImages = async (content: string, postId: string): Promise<string> => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          const imgTags = Array.from(doc.querySelectorAll('img[src^="blob:"]'));

          await Promise.all(
            imgTags.map(async (img) => {
              const blobUrl = img.getAttribute('src');
              if (blobUrl) {
                try {
                  const blob = await getImageFromIndexedDB(postId);
                  if (blob instanceof Blob) {
                    const newBlobUrl = URL.createObjectURL(blob);
                    img.setAttribute('src', newBlobUrl);
                  }
                } catch (error) {
                  console.error(`이미지 로드 실패 (Blob URL: ${blobUrl}):`, error);
                }
              }
            })
          );

          return doc.body.innerHTML;
        };

        updatedContent = await processImages(updatedContent, postId);
        setContent(updatedContent);
      } catch (error) {
        console.error('게시글을 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchPost(); // 비동기 함수 호출
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

// Blob URL에서 이미지 ID 추출 (예시 함수)

export default PostItem;
