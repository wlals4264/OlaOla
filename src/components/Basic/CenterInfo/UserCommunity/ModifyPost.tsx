import React, { useEffect, useState } from 'react';
import { PostCategory } from '../../../../types/PostCategory';
import {
  updatePostInDB,
  saveImageToIndexedDB,
  getImageItemListByPostId,
  deleteImageInDBByImgId,
} from '../../../../utils/indexedDB';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { editorValueState } from '../../../../datas/recoilData';
import QuillEditor from './QuillEditor';
import ChooseLevel from '../../MyFeed/AddFeed/ChooseLevel';
import PostingButtons from './PostingButtons';

interface imageData {
  imageData: Blob;
  postId: number;
  imgId?: string;
}

const ModifyPost: React.FC = () => {
  const location = useLocation();
  const { post, postId } = location.state;
  const navigate = useNavigate();

  console.log('post', post);
  console.log('postId', postId);

  const [centerName, setCenterName] = useState<string>(post.centerName);
  const [postTitle, setPostTitle] = useState<string>(post.postTitle);
  const [postCategory, setPostCategory] = useState<PostCategory>(post.postCategory);
  const [fileList, setFileList] = useState<File[]>([]);
  const [climbingLevel, setClimbingLevel] = useState<string>(post.level);
  const [editorValue, setEditorValue] = useRecoilState<string>(editorValueState);
  const [existingImages, setExistingImages] = useState<imageData[]>([]);

  // 기존 이미지 불러오기
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getImageItemListByPostId(Number(postId));
        setExistingImages(images);
      } catch (error) {
        console.error('이미지 불러오기 실패:', error);
      }
    };

    fetchImages();
  }, [postId]);

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

      // 이미지 태그와 fileList를 매핑하여 imgId가 이미 존재하는 경우 스킵, 없는 경우 새로 설정
      const imgToFileMap = new Map<string, File>();

      imgTags.forEach((img) => {
        const imgId = img.getAttribute('data-img-id');
        if (imgId) {
          // 기존 이미지인 경우
          const existingImage = existingImages.find((image) => image.imgId === imgId);
          if (existingImage) {
            // 기존 이미지는 imgId를 그대로 사용
            imgToFileMap.set(imgId, existingImage.imageData as File); // 기존 파일을 Map에 추가
          } else {
            // 새 이미지인 경우 (imgId가 없거나 새로운 파일)
            const newFile = fileList.shift(); // 새로운 파일을 fileList에서 가져옴
            if (newFile) {
              img.setAttribute('data-img-id', imgId); // 기존 imgId 그대로 유지
              imgToFileMap.set(imgId, newFile); // 새 파일을 Map에 추가
            }
          }
        }
      });

      // 이미지 삭제 처리: 기존 이미지 중 현재 editorValue에서 존재하지 않는 이미지는 삭제
      const currentImgIds = imgTags.map((img) => img.getAttribute('data-img-id'));
      const deletedImages = existingImages.filter((image) => !currentImgIds.includes(image.imgId || ''));

      for (const deletedImage of deletedImages) {
        await deleteImageInDBByImgId(String(deletedImage.imgId)); // IndexedDB에서 삭제
        console.log(`이미지 삭제됨: ${deletedImage.imgId}`);
      }

      // 게시글 업데이트 데이터
      const updateData = {
        postTitle,
        level: climbingLevel,
        content: editorValue,
        updatedAt: new Date().toISOString(),
        centerName,
        postCategory,
      };

      // 게시글 수정 API 호출
      await updatePostInDB(Number(postId), updateData);

      // IndexedDB에 이미지 저장
      for (const [imgId, file] of imgToFileMap.entries()) {
        await saveImageToIndexedDB(file, Number(postId), imgId); // imgId와 함께 저장
      }

      console.log('게시글 수정 및 이미지 업데이트 완료');
      navigate('/center-info/user-community');
    } catch (error) {
      console.error('게시글 수정 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    setEditorValue(post.content);
  }, []);

  console.log(editorValue);

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
          <QuillEditor fileList={fileList} setFileList={setFileList} postId={postId ? postId : null} />
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
