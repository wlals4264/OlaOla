import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { climbingLevelState, editorValueState, userNicknameState, userUIDState } from '../../../../datas/recoilData';
import { addPostToDB } from '../../../../utils/indexedDB';

interface PostingButtonsProps {
  postTitle: string;
  centerName: string;
  postCategory: string;
  updatePostInDB?: () => void;
}

const PostingButtons: React.FC<PostingButtonsProps> = ({ postCategory, postTitle, centerName, updatePostInDB }) => {
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
      updatePostInDB(); // 업데이트 함수가 있을 경우 호출
      navigate('/center-info/user-community'); // 게시 후 페이지 이동
    }
  };

  // 게시글 올리기
  const handlePost = (): void => {
    // 게시글 DB에 저장
    const newPost = {
      userUID,
      userNickName,
      postTitle,
      content: editorValue,
      level: climbingLevel,
      likeCount: 0,
      viewCount: 0,
      updatedAt: new Date(),
      centerName,
      postCategory,
    };

    addPostToDB(newPost);
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
