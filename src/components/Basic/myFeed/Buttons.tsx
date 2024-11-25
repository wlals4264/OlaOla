import { useNavigate } from 'react-router-dom';

const Buttons = () => {
  const navigate = useNavigate();

  const handleCancel = (): void => {
    navigate(-1);
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
        className="flex-shrink-0 text-sm text-white w-86px px-3 py-1 rounded-xl bg-primary flex items-center justify-center">
        게시
      </button>
    </div>
  );
};

export default Buttons;
