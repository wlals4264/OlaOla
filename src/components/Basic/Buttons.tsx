import { useNavigate } from 'react-router-dom';
import { addFileToDB } from '../../utils/indexedDB';
import { userTokenState } from '../../datas/recoilData';
import { useRecoilState } from 'recoil';

interface ButtonsProps {
  selectedFile: File | null;
  selectedFileUrl: string;
  fileType: string;
  describe: string;
}

const Buttons: React.FC<ButtonsProps> = ({ selectedFile, selectedFileUrl, fileType, describe }) => {
  const navigate = useNavigate();
  const [userToken, setUserToken] = useRecoilState(userTokenState);

  const handleCancel = (): void => {
    navigate(-1);
  };

  setUserToken(localStorage.getItem('userToken'));

  const handlePost = (): void => {
    if (selectedFile && selectedFileUrl) {
      // 파일 DB에 저장
      addFileToDB(selectedFileUrl, fileType, describe, userToken);
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
        onClick={handlePost}>
        게시
      </button>
    </div>
  );
};

export default Buttons;
