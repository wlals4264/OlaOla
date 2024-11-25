import { useState } from 'react';

const ChooseLevel = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const handleSelectedLevel = (e: any) => {
    const level = e.target.value;
    setSelectedLevel(level);
  };

  const levelOptions = [
    { value: 'level-white', label: 'White', color: 'white' },
    { value: 'level-yellow', label: 'Yellow', color: '#FFCC00' },
    { value: 'level-orange', label: 'Orange', color: '#ff9502' },
    { value: 'level-green', label: 'Green', color: '#34c759' },
    { value: 'level-blue', label: 'Blue', color: '#007aff' },
    { value: 'level-red', label: 'Red', color: '#ff3b30' },
    { value: 'level-navy', label: 'Navy', color: '#002066' },
    { value: 'level-purple', label: 'Purple', color: '#af52de' },
    { value: 'level-gray', label: 'Gray', color: '#8e8e93' },
  ];

  const selectedColor = levelOptions.find((option) => option.value === selectedLevel)?.color;

  return (
    <fieldset>
      <div className="flex items-center text-xs cursor-default mb-4 min-h-[40px]">
        난이도{' '}
        {selectedLevel && selectedColor && (
          <svg
            className="scale-50"
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20.2588 28.3556L20.0005 28.1994L19.742 28.3551L12.8253 32.5218L12.8244 32.5223C11.9381 33.0587 10.8534 32.2679 11.087 31.2633L12.9203 23.3969L12.9888 23.1031L12.7608 22.9055L6.64409 17.6055L6.64392 17.6054C5.86052 16.9272 6.28474 15.6464 7.30631 15.5652L7.30896 15.5649L15.359 14.8816L15.6591 14.8561L15.7769 14.5789L18.9269 7.16219L18.9277 7.16024C19.3228 6.21888 20.6772 6.21888 21.0723 7.16024L21.073 7.16181L24.223 14.5951L24.3406 14.8728L24.641 14.8983L32.691 15.5816L32.6937 15.5818C33.7153 15.6631 34.1395 16.9439 33.3561 17.622L33.3559 17.6222L27.2392 22.9222L27.0112 23.1197L27.0797 23.4135L28.913 31.28C28.913 31.2801 28.913 31.2801 28.913 31.2802C29.1465 32.2847 28.0618 33.0754 27.1756 32.539L27.1754 32.5389L20.2588 28.3556Z"
              fill={selectedColor}
              stroke={selectedColor !== 'white' ? '' : '#8C8C8C'}
            />
          </svg>
        )}
      </div>

      <div className="flex">
        {levelOptions.map((option) => (
          <div key={option.value}>
            <input
              id={option.value}
              name="level"
              value={option.value}
              aria-label={option.label}
              className="hidden"
              onClick={handleSelectedLevel}
            />
            <label htmlFor={option.value}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hover:scale-110 transition-transform">
                <path
                  d="M20 28.7834L26.9167 32.9667C28.1833 33.7334 29.7333 32.6001 29.4 31.1667L27.5667 23.3001L33.6833 18.0001C34.8 17.0334 34.2 15.2001 32.7333 15.0834L24.6833 14.4001L21.5333 6.96672C20.9667 5.61672 19.0333 5.61672 18.4667 6.96672L15.3167 14.3834L7.26667 15.0667C5.8 15.1834 5.2 17.0167 6.31667 17.9834L12.4333 23.2834L10.6 31.1501C10.2667 32.5834 11.8167 33.7167 13.0833 32.9501L20 28.7834Z"
                  fill={option.color}
                  stroke={option.color !== 'white' ? '' : '#8C8C8C'}
                />
              </svg>
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default ChooseLevel;
