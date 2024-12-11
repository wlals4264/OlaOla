import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid'; //
import { climbingLevelState, editorValueState, userNicknameState, userUIDState } from '../../../../datas/recoilData';
import { addPostToDB, saveImageToIndexedDB } from '../../../../utils/indexedDB';

interface PostingButtonsProps {
  fileList: File[] | null;
  postTitle: string;
  centerName: string;
  postCategory: string;
  updatePostInDB?: () => void;
}

const PostingButtons: React.FC<PostingButtonsProps> = ({
  fileList,
  postCategory,
  postTitle,
  centerName,
  updatePostInDB,
}) => {
  const navigate = useNavigate();
  const climbingLevel = useRecoilValue(climbingLevelState);
  const userUID = useRecoilValue(userUIDState);
  const userNickName = useRecoilValue(userNicknameState);
  const editorValue = useRecoilValue(editorValueState);

  // 취소하기
  const handleCancel = (): void => {
    navigate(-1);
  };

  // 수정하기
  const handleUpdate = (): void => {
    if (updatePostInDB) {
      updatePostInDB();
      navigate('/center-info/user-community');
    }
  };

  // 게시글 올리기 & db에 이미지 저장
  const handlePost = async (): Promise<void> => {
    try {
      // DOMParser를 이용해 editorValue 파싱
      const parser = new DOMParser();
      const doc = parser.parseFromString(editorValue, 'text/html');

      // blob URL이 포함된 img 태그 추출
      const imgTags = Array.from(doc.querySelectorAll('img[src^="blob:"]')) as HTMLImageElement[];

      // 이미지 태그에 고유 ID 추가
      // imgTags.forEach((img) => {
      //   const imgId = uuidv4();
      //   img.setAttribute('data-img-id', imgId);
      // });

      const updatedContent = doc.body.innerHTML;

      // 게시글 DB에 저장
      const post = {
        userUID,
        userNickName,
        postTitle,
        content: updatedContent,
        level: climbingLevel,
        likeCount: 0, // 기본값
        viewCount: 0, // 기본값
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        centerName,
        postCategory,
      };

      const postId = await addPostToDB(post);

      // DB에 file 업로드 및 id 매핑
      if (fileList) {
        const imgToFileMap = new Map();

        // imgTags와 fileList 매핑 (순서에 따라 매핑)
        imgTags.forEach((img, index) => {
          const imgId = img.getAttribute('data-img-id');
          if (imgId && fileList[index]) {
            imgToFileMap.set(imgId, fileList[index]); // imgId와 file을 매핑
          }
        });

        // IndexedDB에 저장
        for (const [imgId, file] of imgToFileMap.entries()) {
          await saveImageToIndexedDB(file, postId, imgId); // imgId와 함께 저장
        }
      }

      // 게시 후 추가 동작
      navigate('/center-info/user-community');
    } catch (error) {
      console.error('Error during post handling:', error);
    }
  };

  return (
    <div className="flex justify-end gap-4 mt-4">
      <button
        type="button"
        className="flex-shrink-0 text-sm text-black w-86px px-3 py-1 rounded-xl bg-white flex items-center justify-center ring-1 ring-gray-200"
        onClick={handleCancel}>
        취소
      </button>
      <button
        type="button"
        className="flex-shrink-0 text-sm text-white w-86px px-3 py-1 rounded-xl bg-primary flex items-center justify-center"
        onClick={updatePostInDB ? handleUpdate : handlePost}>
        {updatePostInDB ? '수정' : '게시'}
      </button>
    </div>
  );
};

export default PostingButtons;
