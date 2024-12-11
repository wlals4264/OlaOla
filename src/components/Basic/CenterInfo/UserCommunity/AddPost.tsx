import React, { useState } from 'react';
import ChooseLevel from '../../MyFeed/AddFeed/ChooseLevel';
import PostingButtons from './PostingButtons';
import QuillEditor from './QuillEditor';
import { PostCategory } from '../../../Types/PostCategory';

const AddPost: React.FC = () => {
  const [currentClimbingLevel, setCurrentClimbingLevel] = useState<string>('');
  const [centerName, setCenterName] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const [postCategory, setPostCategory] = useState<PostCategory>(PostCategory.FREETALK);
  const [fileList, setFileList] = useState<File[]>([]);

  // ChooseLevel의 onClimbingLevelChange 핸들러
  const handleClimbingLevelChange = (newClimbingLevel: string): void => {
    setCurrentClimbingLevel(newClimbingLevel);
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
            className="w-28 h-12 focus:outline-none">
            <option value={PostCategory.FREETALK}>{PostCategory.FREETALK}</option>
            <option value={PostCategory.NEWSETTING}>{PostCategory.NEWSETTING}</option>
            <option value={PostCategory.CENTERREVIEW}>{PostCategory.CENTERREVIEW}</option>
            <option value={PostCategory.CREWRECRUIT}>{PostCategory.CREWRECRUIT}</option>
          </select>

          {/* 제목 input */}
          <input
            type="text"
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="제목을 적어주세요."
            className="w-full h-12 font-extrabold text-3xl  focus:outline-none"
          />
        </div>

        {/* 텍스트 편집기 */}
        <div className="mb-12">
          <QuillEditor content={''} fileList={fileList} setFileList={setFileList} />
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
              placeholder="암장 이름을 태그해주세요."
              className="h-10 mb-4 focus:outline-none "
            />
          </div>

          {/* 난이도 선택창 */}
          {postCategory === PostCategory.NEWSETTING && (
            <ChooseLevel
              currentClimbingLevel={currentClimbingLevel}
              onClimbingLevelChange={handleClimbingLevelChange}
            />
          )}

          {/* 게시글 버튼 */}
          {/* QuillEditor로 부터 받은 fileList를 넘겨줌 */}
          <div className="flex items-end mb-5">
            <PostingButtons
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

export default AddPost;
