import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddFeedButton: React.FC = () => {
  const navigator = useNavigate();
  const AddFeedOpen = () => {
    console.log('AddFeedButton');
    navigator('/add-feed');
  };

  return (
    <div className="max-w-2xl m-auto mt-4">
      <div className="flex items-end justify-end">
        <button onClick={AddFeedOpen}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.5 8.125H11.875V2.5C11.875 1.80977 11.3152 1.25 10.625 1.25H9.375C8.68477 1.25 8.125 1.80977 8.125 2.5V8.125H2.5C1.80977 8.125 1.25 8.68477 1.25 9.375V10.625C1.25 11.3152 1.80977 11.875 2.5 11.875H8.125V17.5C8.125 18.1902 8.68477 18.75 9.375 18.75H10.625C11.3152 18.75 11.875 18.1902 11.875 17.5V11.875H17.5C18.1902 11.875 18.75 11.3152 18.75 10.625V9.375C18.75 8.68477 18.1902 8.125 17.5 8.125Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddFeedButton;
