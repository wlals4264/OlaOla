import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userUIDState, isFeedItemModalOpenState, userNicknameState } from '../../../../datas/recoilData';
import {
  addCommentToDB,
  getCommentsListFromDB,
  deleteCommentInDB,
  updateCommentInDB,
} from '../../../../utils/indexedDB';

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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedComment, setEditedComment] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
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

  const handleCommentModify = (commentId: number) => {
    if (editedComment.trim()) {
      updateCommentInDB(commentId, storeName, { comment: editedComment }).then(() => {
        setCommentsList((prevCommentsList) =>
          prevCommentsList.map((comment) =>
            comment.id === commentId ? { ...comment, comment: editedComment } : comment
          )
        );
        setIsEditing(false);
        setEditedComment('');
        setEditingCommentId(null);
      });
    } else {
      alert('수정할 댓글을 입력해주세요!');
    }
  };

  const handleEditClick = (commentId: number, currentComment: string) => {
    setIsEditing(true);
    setEditingCommentId(commentId);
    setEditedComment(currentComment);
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
      <div className="space-y-2 mt-10 mb-1 p-2">
        {/* 댓글 리스트 컨테이너 */}
        <div>
          {commentsList.map((comment, index) => {
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-start">
                  <span className="font-semibold text-sm mr-2">{comment.userNickName}</span>
                  {isEditing && editingCommentId === comment.id ? (
                    <textarea
                      className="min-w-[640px] h-[16px] font-normal text-xs outline-none resize-none mt-[1px]"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                  ) : (
                    <p className="font-normal text-xs flex-1 mt-[1px] ">{comment.comment}</p>
                  )}
                </div>

                {nowLoginUserUID === comment.userUID ? (
                  <div className="flex gap-1">
                    {isEditing && editingCommentId === comment.id ? (
                      <button
                        type="button"
                        onClick={() => handleCommentModify(comment.id as number)}
                        className="text-primary">
                        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M4.41538 9.50387L0.190373 5.27886C-0.0634576 5.02503 -0.0634576 4.61347 0.190373 4.35962L1.10959 3.44038C1.36342 3.18652 1.775 3.18652 2.02883 3.44038L4.875 6.28651L10.9712 0.190373C11.225 -0.0634576 11.6366 -0.0634576 11.8904 0.190373L12.8096 1.10962C13.0635 1.36345 13.0635 1.775 12.8096 2.02886L5.33462 9.50389C5.08076 9.75772 4.66921 9.75772 4.41538 9.50387Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEditClick(comment.id as number, comment.comment)}
                        className="text-primary">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M5.78283 1.9699L8.28315 4.47034L2.8538 9.89992L0.624564 10.146C0.326134 10.179 0.0739922 9.92667 0.107194 9.62823L0.355235 7.39734L5.78283 1.9699ZM9.8296 1.59763L8.6556 0.423589C8.2894 0.0573715 7.69547 0.0573715 7.32927 0.423589L6.22481 1.5281L8.72513 4.02853L9.8296 2.92402C10.1958 2.55761 10.1958 1.96385 9.8296 1.59763Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    )}
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
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 댓글창 */}
      <form className="w-full mt-1" onSubmit={handleCommentSubmit}>
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
