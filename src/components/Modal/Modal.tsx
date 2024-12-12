import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed font-noto inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}>
      <div className="bg-white py-10 px-2 rounded-3xl w-fit min-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4" onClick={onClose}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.8753 7.13752C22.3878 6.65002 21.6003 6.65002 21.1128 7.13752L15.0003 13.2375L8.88777 7.12502C8.40027 6.63752 7.61277 6.63752 7.12527 7.12502C6.63777 7.61252 6.63777 8.40003 7.12527 8.88753L13.2378 15L7.12527 21.1125C6.63777 21.6 6.63777 22.3875 7.12527 22.875C7.61277 23.3625 8.40027 23.3625 8.88777 22.875L15.0003 16.7625L21.1128 22.875C21.6003 23.3625 22.3878 23.3625 22.8753 22.875C23.3628 22.3875 23.3628 21.6 22.8753 21.1125L16.7628 15L22.8753 8.88753C23.3503 8.41253 23.3503 7.61252 22.8753 7.13752Z"
              fill="black"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
