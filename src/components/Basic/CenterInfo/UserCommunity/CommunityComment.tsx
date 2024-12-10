import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userUIDState, isFeedItemModalOpenState, userNicknameState } from '../../../../datas/recoilData';
import { addCommentToDB, getCommentsListFromDB, deleteCommentInDB } from '../../../../utils/indexedDB';

// Props 타입 정의
interface CommentProps {
  postId: number;
}

interface CommentType {
  id?: number;
  userNickName: string;
  comment: string;
  userUID: string | null;
  ItemId: number;
}

const CommunityComment: React.FC<CommentProps> = ({ postId }) => {
  const [comment, setComment] = useState<string>('');
  const [commentsList, setCommentsList] = useState<CommentType[]>([]);
  const userNickName = useRecoilValue(userNicknameState);
  const userUID = useRecoilValue(userUIDState);
  const setFeedItemModalOpen = useSetRecoilState(isFeedItemModalOpenState);
  const storeName = 'postCommentData';

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (comment) {
      addCommentToDB(storeName, { comment, userUID, ItemId: postId, userNickName })
        .then((newCommentWithId) => {
          // DB에서 id를 받아오는 형태
          setCommentsList((prevCommentsList) => [
            ...prevCommentsList,
            { ...newCommentWithId, comment, userUID, ItemId: postId, userNickName }, // id 포함
          ]);
          setFeedItemModalOpen(true);
          setComment('');
        })
        .catch((error) => {
          console.error('댓글 저장 오류', error);
        });
      console.log({ userNickName, comment, userUID: userUID, ItemId: postId });
    } else {
      alert('댓글을 입력해주세요!');
    }
  };

  const handleCommentDelete = (commentId: number) => {
    deleteCommentInDB(storeName, commentId).then(() => {
      setCommentsList(
        (prevCommentsList) => prevCommentsList.filter((comment) => comment.id !== commentId) // `id`를 그대로 사용
      );
    });
  };

  useEffect(() => {
    getCommentsListFromDB(storeName).then((comments) => {
      const filteredComments = comments.filter((comment) => comment.ItemId === postId);
      setCommentsList(filteredComments);
    });
  }, [postId]);

  const nowLoginUserUID = localStorage.getItem('userUID');

  return (
    <>
      <div className="h-16 mt-10 mb-2 p-2">
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
                      handleCommentDelete(Number(comment.id));
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
      <form className="w-full mt-10" onSubmit={handleCommentSubmit}>
        <textarea
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 남겨주세요!"
          value={comment}
          className="w-full h-20 px-4 py-3 rounded-xl text-sm outline-none resize-none border-gray-100 border-[1px]"></textarea>
        <div className="flex justify-end items-center my-4">
          <button type="submit" className="bg-primary rounded-md px-4 py-1 font-bold text-white">
            댓글 작성
          </button>
        </div>
      </form>
    </>
  );
};

export default CommunityComment;
