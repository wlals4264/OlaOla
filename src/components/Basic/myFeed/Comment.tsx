import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userUIDState, isFeedItemModalOpenState, userNicknameState, isLoginUserState } from '../../../datas/recoilData';
import { addCommentToDB, getCommentsListFromDB, deleteCommentInDB } from '../../../utils/indexedDB';

// Props 타입 정의
interface CommentProps {
  feedItemId: number;
}

interface CommentType {
  userNickName: string;
  comment: string;
  userUID: string | null;
  ItemId: number;
}

const Comment: React.FC<CommentProps> = ({ feedItemId }) => {
  const [comment, setComment] = useState<string>('');
  const [commentsList, setCommentsList] = useState<CommentType[]>([]);
  const userNickName = useRecoilValue(userNicknameState);
  const userUID = useRecoilValue(userUIDState);
  const [commentWriterUID, setCommentWriterUID] = useState<string | null>('');
  const setFeedItemModalOpen = useSetRecoilState(isFeedItemModalOpenState);
  const isLoginUser = useRecoilValue(isLoginUserState);
  const storeName = 'feedCommentData';

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoginUser) {
      setComment(e.target.value);
    } else {
      alert('로그인 후 이용해주세요.');
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (comment) {
      // 파일 DB에 저장
      addCommentToDB(storeName, { comment, userUID, ItemId: feedItemId, userNickName });
      setCommentsList((prevCommentsList) => [
        ...prevCommentsList,
        { userNickName, comment, userUID: userUID, ItemId: feedItemId },
      ]);
      setFeedItemModalOpen(true);
      setCommentWriterUID(userUID);
      setComment('');
    } else {
      alert('댓글을 입력해주세요!');
    }
  };

  const handleCommentDelete = (commentId: number) => {
    deleteCommentInDB(storeName, commentId).then(() => {
      console.log(commentId);
      setCommentsList(
        (prevCommentsList) => prevCommentsList.filter((comment) => comment.id !== commentId) // `id`를 그대로 사용
      );
    });
  };

  useEffect(() => {
    getCommentsListFromDB(storeName).then((comments) => {
      const filteredComments = comments.filter((comment) => comment.ItemId === feedItemId);
      setCommentsList(filteredComments);
    });
  }, [feedItemId]);

  const nowLoginUserUID = localStorage.getItem('userUID');

  return (
    <>
      <div className="h-16 my-2 py-1">
        <div className="max-h-[60px] overflow-y-auto scrollbar-hide">
          {commentsList.map((comment, index) => {
            return (
              <div key={index} className="flex items-center">
                <span className="font-semibold text-sm mr-2">{comment.userNickName}</span>
                <p className="font-normal text-xs flex-1">{comment.comment}</p>
                {nowLoginUserUID === comment.userUID ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleCommentDelete(comment.id);
                    }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11.4377 3.5687C11.1939 3.32495 10.8002 3.32495 10.5564 3.5687L7.5002 6.6187L4.44395 3.56245C4.2002 3.3187 3.80645 3.3187 3.5627 3.56245C3.31895 3.8062 3.31895 4.19995 3.5627 4.4437L6.61895 7.49995L3.5627 10.5562C3.31895 10.8 3.31895 11.1937 3.5627 11.4375C3.80645 11.6812 4.2002 11.6812 4.44395 11.4375L7.5002 8.3812L10.5564 11.4375C10.8002 11.6812 11.1939 11.6812 11.4377 11.4375C11.6814 11.1937 11.6814 10.8 11.4377 10.5562L8.38145 7.49995L11.4377 4.4437C11.6752 4.2062 11.6752 3.8062 11.4377 3.5687Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 댓글창 */}
      <form
        className="relative flex items-center w-[360px] border border-gray-300 rounded-xl mt-2"
        onSubmit={handleCommentSubmit}>
        {!isLoginUser ? (
          <input
            type="text"
            onChange={handleCommentChange}
            className="w-full h-8 px-3 py-[6px] rounded-xl text-xs items-center outline-none pointer-events-none"
            placeholder="로그인 후 이용해주세요."
          />
        ) : (
          <input
            onChange={handleCommentChange}
            type="text"
            placeholder="댓글을 남겨주세요!"
            value={comment}
            className="w-full h-8 px-3 py-[6px] rounded-xl text-xs items-center outline-none focus:ring-2 focus:ring-primary"
          />
        )}

        {isLoginUser && (
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
            <svg className="w-6 h-6 text-black" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.378 8.125H13.4451V2.5C13.4451 1.80977 12.8547 1.25 12.1267 1.25H10.8083C10.0802 1.25 9.48984 1.80977 9.48984 2.5V8.125H3.55695C2.82893 8.125 2.23853 8.68477 2.23853 9.375V10.625C2.23853 11.3152 2.82893 11.875 3.55695 11.875H9.48984V17.5C9.48984 18.1902 10.0802 18.75 10.8083 18.75H12.1267C12.8547 18.75 13.4451 18.1902 13.4451 17.5V11.875H19.378C20.106 11.875 20.6964 11.3152 20.6964 10.625V9.375C20.6964 8.68477 20.106 8.125 19.378 8.125Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </form>
    </>
  );
};

export default Comment;
