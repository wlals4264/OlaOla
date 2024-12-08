import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
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
    // 게시글 DB에 저장
    const newPost = {
      userUID,
      userNickName,
      postTitle,
      content: editorValue,
      level: climbingLevel,
      likeCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      centerName,
      postCategory,
    };

    // editorValue에서 이미지 태그를 찾아 id를 추가
    const updatedEditorValue = editorValue.replace(/<img([^>]*)>/g, (match) => {
      const imageId = `img-${Date.now()}`; // 간단한 고유 ID 생성
      return match.replace(/<img([^>]*)>/, `<img$1 id="${imageId}">`); // 이미지에 ID 추가
    });

    newPost.content = updatedEditorValue;

    const postId = await addPostToDB(newPost);

    // DB에 file 업로드
    if (fileList) {
      for (const file of fileList) {
        saveImageToIndexedDB(file, postId);
      }
    }

    // 게시 후 추가 동작
    navigate('/center-info/user-community'); // 게시 후 페이지 이동
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
