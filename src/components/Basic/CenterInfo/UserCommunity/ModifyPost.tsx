import React, { useState, useEffect } from 'react';
import ChooseLevel from '../../MyFeed/AddFeed/ChooseLevel';
import PostingButtons from './PostingButtons';
import QuillEditor from './QuillEditor';
import { v4 as uuidv4 } from 'uuid';
import { PostCategory } from '../../../Types/PostCategory';
import { updatePostInDB, saveImageToIndexedDB, getImageIdByPostId, deleteImageInDB } from '../../../../utils/indexedDB';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { editorValueState } from '../../../../datas/recoilData';

const ModifyPost: React.FC = () => {
  const location = useLocation();
  const { post, postId } = location.state;

  console.log('post', post);
  console.log('postId', postId);

  const [centerName, setCenterName] = useState<string>(post.centerName);
  const [postTitle, setPostTitle] = useState<string>(post.postTitle);
  const [postCategory, setPostCategory] = useState<PostCategory>(post.postCategory);
  const [fileList, setFileList] = useState<File[]>([]);
  const [content, setContent] = useState<string>(post.content);
  const [climbingLevel, setClimbingLevel] = useState<string>(post.level);
  const editorValue = useRecoilValue(editorValueState);

  // 난이도 변경 시 상태 업데이트 함수
  const handleClimbingLevelChange = (newClimbingLevel: string) => {
    setClimbingLevel(newClimbingLevel);
  };

  // DB 수정 함수 호출
  const handleUpdate = async () => {
    try {
      // DOMParser를 이용해 editorValue 파싱
      const parser = new DOMParser();
      const doc = parser.parseFromString(editorValue, 'text/html');

      // blob URL이 포함된 img 태그 추출
      const imgTags = Array.from(doc.querySelectorAll('img[src^="blob:"]')) as HTMLImageElement[];

      // 이미지 태그에 고유 ID 추가
      imgTags.forEach((img) => {
        const imgId = uuidv4();
        img.setAttribute('data-img-id', imgId);
      });

      const updatedContent = doc.body.innerHTML;

      // 게시글 DB에 저장
      const updateData = {
        postTitle: postTitle,
        level: climbingLevel,
        content: updatedContent,
        updatedAt: new Date().toISOString(),
        centerName: centerName,
        postCategory: postCategory,
      };

      const updatePostId = await await updatePostInDB(Number(postId), updateData);

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

        // deleteImageInDB(updatePostId);

        // IndexedDB에 저장
        for (const [imgId, file] of imgToFileMap.entries()) {
          await saveImageToIndexedDB(file, postId, imgId); // imgId와 함께 저장
        }
      }

      console.log('파일이 성공적으로 수정되었습니다!');
    } catch (error) {
      console.log('파일 수정 실패: ' + error);
    }
  };

  return (
    <div>
      <div className="flex flex-col max-w-[752px] m-auto">
        {/* header */}
        <h1 className="w-full h-12 flex items-center justify-center rounded-xl mt-4 mb-4 bg-primary font-extrabold text-xl text-indigo-600">
          새로운 소식을 유저들과 공유해주세요!
        </h1>
        <div className="flex gap-4 mb-4">
          {/* 타입 input */}
          <select
            onChange={(e) => setPostCategory(e.target.value as PostCategory)}
            className="w-28 h-12 focus:outline-none"
            value={postCategory}>
            <option value={PostCategory.FREETALK}>{PostCategory.FREETALK}</option>
            <option value={PostCategory.NEWSETTING}>{PostCategory.NEWSETTING}</option>
            <option value={PostCategory.CENTERREVIEW}>{PostCategory.CENTERREVIEW}</option>
            <option value={PostCategory.CREWRECRUIT}>{PostCategory.CREWRECRUIT}</option>
          </select>
          {/* 제목 input */}
          <input
            type="text"
            onChange={(e) => setPostTitle(e.target.value)}
            value={postTitle}
            className="w-full h-12 font-extrabold text-3xl  focus:outline-none"
          />
        </div>

        {/* 텍스트 편집기 */}
        <div className="mb-12">
          <QuillEditor
            content={content} // content 값 전달
            setContent={setContent} // 수정된 content 값을 부모 컴포넌트로 전달하는 함수
            fileList={fileList}
            setFileList={setFileList}
          />
        </div>

        {/* 암장명 & 난이도 선택창 & buttons */}
        <div className="flex justify-between">
          {/* 암장명 입력창 */}
          <div className="flex flex-col">
            <label htmlFor="centerName" className="flex items-center text-xs cursor-default mb-4 min-h-[40px]">
              암장명
            </label>
            <input
              id="centerName"
              type="text"
              onChange={(e) => setCenterName(e.target.value)}
              value={centerName}
              className="h-10 mb-4 focus:outline-none "
            />
          </div>

          {/* 난이도 선택창 */}
          {postCategory === PostCategory.NEWSETTING && (
            <ChooseLevel currentClimbingLevel={climbingLevel} onClimbingLevelChange={handleClimbingLevelChange} />
          )}

          {/* 게시글 버튼 */}
          <div className="flex items-end mb-5">
            <PostingButtons
              updatePostInDB={handleUpdate}
              fileList={fileList}
              postCategory={postCategory}
              postTitle={postTitle}
              centerName={centerName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPost;
