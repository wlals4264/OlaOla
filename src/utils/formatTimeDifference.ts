/**
 * 수정된 시간과 현재 시간의 차이를 계산하여 적절한 형식으로 반환한다.
 * @param updatedTime - 수정된 시간 (Date 객체)
 * @returns 몇 분 전, 몇 시간 전, 몇 일 전, 몇 달 전, 몇 년 전 형식의 문자열
 **/

export function formatTimeDifference(updatedTime: Date): string {
  const now = new Date(); // 현재 시간
  const updated = new Date(updatedTime); // 수정된 시간
  const diffInSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000); // 현재 시간과 수정된 시간의 차를 밀리초 -> 초 단위로 변환

  // 0. 방금 전
  if (diffInSeconds < 60) {
    return '방금 전';
  }

  // 1. 몇 분 전
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  // 2. 몇 시간 전
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }

  // 3. 몇 일 전
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}일 전`;
  }

  // 4. 몇 달 전(편의성을 위해 한달을 30일 고정값으로 계산)
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}달 전`;
  }

  // 5. 몇 년 전
  const years = Math.floor(months / 12);
  return `${years}년 전`;
}
