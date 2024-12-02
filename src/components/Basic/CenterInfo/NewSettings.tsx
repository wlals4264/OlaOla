import React from 'react';
import CenterHeader from './CenterHeader';
import Sidebar from './Sidebar';

const NewSettings: React.FC = () => {
  return (
    <div>
      <CenterHeader />
      <div className="flex">
        <Sidebar />
        <div className="w-full flex flex-col gap-10 mt-10 items-center font-noto"></div>
      </div>
    </div>
  );
};

export default NewSettings;
