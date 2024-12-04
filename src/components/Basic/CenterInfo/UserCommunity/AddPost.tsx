import React from 'react';
import ChooseLevel from '../../MyFeed/AddFeed/ChooseLevel';
import PostingButtons from './PostingButtons';
import QuillEditor from './QuillEditor';

const AddPost: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col max-w-[752px] m-auto">
        <h1 className="w-full h-12 flex items-center justify-center rounded-xl mt-4 mb-4 bg-primary font-extrabold text-xl text-indigo-600">
          새로운 소식을 유저들과 공유해주세요!
        </h1>
        <form id="postContent" action="submit" className="w-full flex flex-col ">
          <input
            type="text"
            placeholder="제목을 적어주세요."
            className="w-full h-12 font-extrabold text-3xl mb-4 focus:outline-none"
          />

          <QuillEditor />
          {/* <textarea
            name="postContent"
            id="content"
            placeholder="내용을 적어주세요."
            className="w-full h-[380px] focus:outline-none resize-none"
          /> */}
        </form>
        {/* 암장명 & 난이도 선택창 & buttons */}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <label htmlFor="center-name" className="flex items-center text-xs cursor-default mb-4 min-h-[40px]">
              암장명
            </label>
            <input
              id="center-name"
              type="text"
              placeholder="암장명을 입력해주세요."
              className="h-10 mb-4 focus:outline-none "
            />
          </div>
          <ChooseLevel />
          <div className="flex items-end mb-5">
            <PostingButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
