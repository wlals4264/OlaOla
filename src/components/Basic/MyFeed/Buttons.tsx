import { useNavigate } from 'react-router-dom';
import { addFileToDB } from '../../../utils/indexedDB';
import { useRecoilValue } from 'recoil';
import { climbingLevelState, userUIDState } from '../../../datas/recoilData';

interface ButtonsProps {
  selectedFile: File | null;
  selectedFileUrl: string;
  fileType: string;
  describe: string;
  centerName: string;
  updateFileInDB?: () => void;
}

const Buttons: React.FC<ButtonsProps> = ({
  selectedFile,
  selectedFileUrl,
  fileType,
  describe,
  centerName,
  updateFileInDB,
}) => {
  const navigate = useNavigate();
  const climbingLevel = useRecoilValue(climbingLevelState);
  const userUID = useRecoilValue(userUIDState);

  const handleCancel = (): void => {
    navigate(-1);
  };

  // 수정하기
  const handleUpdate = (): void => {
    if (updateFileInDB) {
      updateFileInDB(); // 업데이트 함수가 있을 경우 호출
      navigate('/my-feed'); // 게시 후 페이지 이동
    }
  };

  // 게시글 올리기
  const handlePost = (): void => {
    if (selectedFile && selectedFileUrl) {
      // 파일 DB에 저장
      addFileToDB(selectedFile, fileType, describe, userUID, climbingLevel, centerName);
      // 게시 후 추가 동작
      navigate('/my-feed'); // 게시 후 페이지 이동
    } else {
      alert('파일을 선택해 주세요.');
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
        onClick={updateFileInDB ? handleUpdate : handlePost}>
        {updateFileInDB ? '수정' : '게시'}
      </button>
    </div>
  );
};

export default Buttons;
