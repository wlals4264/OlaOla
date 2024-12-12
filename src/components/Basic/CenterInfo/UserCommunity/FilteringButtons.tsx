import React from 'react';
import { getCommentsListFromDB } from '../../../../utils/indexedDB';
import { useSetRecoilState } from 'recoil';
import { sortedPostIdsByCommentCountState } from '../../../../datas/recoilData.ts';

const FilteringButtons: React.FC = () => {
  const setSortedPostIdsByCommentCount = useSetRecoilState(sortedPostIdsByCommentCountState);

  const handleFilteringCommentCount = async () => {
    const postComment = await getCommentsListFromDB('postCommentData');
    console.log(postComment);

    if (postComment.length > 0) {
      const itemCount: { [key: string]: number } = {};

      postComment.forEach((comment) => {
        const itemId = comment.ItemId;
        itemCount[itemId] = (itemCount[itemId] || 0) + 1;
      });

      const sortedItemIds = Object.entries(itemCount)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]);

      setSortedPostIdsByCommentCount(sortedItemIds);

      console.log('sortedItemIds:  ', sortedItemIds);
    }
  };

  return (
    <div className="flex gap-3 font-noto">
      <button className="shrink-0" type="button" onClick={handleFilteringCommentCount}>
        댓글순
      </button>
      <button className="shrink-0" type="button">
        좋아요순
      </button>
    </div>
  );
};

export default FilteringButtons;
