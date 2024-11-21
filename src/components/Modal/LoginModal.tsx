import React from 'react';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // 모달이 열리지 않으면 아무 것도 렌더링하지 않음

  return (
    <div
      className="fixed font-noto inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}>
      <div
        className="bg-white py-10 px-2 rounded-3xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} // 모달 클릭 시, 모달이 닫히지 않도록 함
      >
        {/* 닫힘 버튼 */}
        <button className="absolute top-4 right-4" onClick={onClose}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.8753 7.13752C22.3878 6.65002 21.6003 6.65002 21.1128 7.13752L15.0003 13.2375L8.88777 7.12502C8.40027 6.63752 7.61277 6.63752 7.12527 7.12502C6.63777 7.61252 6.63777 8.40003 7.12527 8.88753L13.2378 15L7.12527 21.1125C6.63777 21.6 6.63777 22.3875 7.12527 22.875C7.61277 23.3625 8.40027 23.3625 8.88777 22.875L15.0003 16.7625L21.1128 22.875C21.6003 23.3625 22.3878 23.3625 22.8753 22.875C23.3628 22.3875 23.3628 21.6 22.8753 21.1125L16.7628 15L22.8753 8.88753C23.3503 8.41253 23.3503 7.61252 22.8753 7.13752Z"
              fill="black"
            />
          </svg>
        </button>

        {/* title */}
        <div className="flex items-center justify-center gap-2">
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22.5" cy="22.5" r="22.5" fill="#A5E1FF" />
            <path
              d="M34.8017 29.0742L23.5517 11.5742C23.3216 11.2164 22.9255 11 22.5001 11C22.0747 11 21.6786 11.2164 21.4486 11.5742L10.1986 29.0742C10.0772 29.2631 10.0088 29.4811 10.0008 29.7054C9.99276 29.9298 10.0453 30.1522 10.1529 30.3492C10.2605 30.5462 10.4192 30.7106 10.6122 30.8251C10.8053 30.9396 11.0256 31 11.2501 31H33.7501C34.2075 31 34.6282 30.7504 34.8474 30.3488C34.955 30.1519 35.0075 29.9295 34.9994 29.7053C34.9914 29.481 34.9231 29.263 34.8017 29.0742ZM22.5001 14.5617L25.8357 19.75H22.5001L20.0001 22.25L18.5134 20.7633L22.5001 14.5617Z"
              fill="black"
            />
          </svg>
          <h2 className="text-3xl font-itim ext-center">OlaOla</h2>
        </div>

        {/* form */}
        <form className="m-6 p-6">
          <div className="mb-4">
            <label htmlFor="email" className="text-xs text-gray-400">
              이메일
            </label>
            <input
              id="email"
              type="text"
              placeholder="Email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="text-xs text-gray-400">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary">
              로그인
            </button>
          </div>

          <p className="mb-4 font-semibold text-center">또는</p>
          <div className="mb-4">
            <button
              type="button"
              className="w-full py-2 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <div className="flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_8_947)">
                    <path
                      d="M19.5312 10.2266C19.5312 15.7539 15.7461 19.6875 10.1562 19.6875C4.79688 19.6875 0.46875 15.3594 0.46875 10C0.46875 4.64063 4.79688 0.3125 10.1562 0.3125C12.7656 0.3125 14.9609 1.26953 16.6523 2.84766L14.0156 5.38281C10.5664 2.05469 4.15234 4.55469 4.15234 10C4.15234 13.3789 6.85156 16.1172 10.1562 16.1172C13.9922 16.1172 15.4297 13.3672 15.6562 11.9414H10.1562V8.60937H19.3789C19.4688 9.10547 19.5312 9.58203 19.5312 10.2266Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_8_947">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Google로 로그인 하기
              </div>
            </button>
          </div>
          <div className="mb-4">
            <button
              type="button"
              className="w-full py-2 bg-gray-200 text-black font-semibold rounded-2xl hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary">
              회원가입 하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
