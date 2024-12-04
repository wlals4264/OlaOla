import { atom, selector, DefaultValue } from 'recoil';

export const userUIDState = atom<string | null>({
  key: 'userUIDState',
  default: localStorage.getItem('userUID') || null,
});

export const updateUserUIDState = selector<string | null>({
  key: 'updateUserUIDState',
  get: ({ get }) => get(userUIDState),
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }

    set(userUIDState, newValue);
    if (newValue !== null) {
      localStorage.setItem('userUID', newValue);
    } else {
      localStorage.removeItem('userUID');
    }
  },
});

// email
export const userEmailState = atom<string>({
  key: 'userEmailState',
  default: '',
});

// nickname
export const userNicknameState = atom<string>({
  key: 'userNicknameState',
  default: '',
});

// userImg
export const userImgState = atom<string | null>({
  key: 'userImgState',
  default: null,
});

// LoginModalOpenState
export const isLoginModalOpenState = atom<boolean>({
  key: 'isLoginModalOpenState',
  default: false,
});

// JoinModalOpenState
export const isJoinModalOpenState = atom<boolean>({
  key: 'isJoinModalOpenState',
  default: false,
});

// SuccessModalOpenState
export const isSuccessModalOpenState = atom<boolean>({
  key: 'isSuccessModalOpenState',
  default: false,
});

// isFeedItemModalOpenState
export const isFeedItemModalOpenState = atom({
  key: 'isFeedItemModalOpenState',
  default: false,
});

// level
export const climbingLevelState = atom<string>({
  key: 'climbingLevel',
  default: '',
});

// editorValue
export const editorValueState = atom<string>({
  key: 'editorValueState',
  default: '',
});

// 로그인 상태를 로컬 스토리지에서 불러오거나 기본값 설정
export const isLoginUserState = atom<boolean>({
  key: 'isLoginUserState',
  default: localStorage.getItem('isLoginUser') === 'true', // 로컬 스토리지에서 값을 읽어옴
});

// 로그인 상태를 업데이트할 때 로컬 스토리지에 저장하는 selector
export const updateLoginUserState = selector({
  key: 'updateLoginUserState',
  get: ({ get }) => get(isLoginUserState),
  set: ({ set }, newValue: boolean | DefaultValue) => {
    // DefaultValue일 경우 아무 작업도 하지 않음
    if (newValue instanceof DefaultValue) {
      return;
    }

    // 상태를 업데이트
    set(isLoginUserState, newValue);

    // 로컬 스토리지에 저장
    localStorage.setItem('isLoginUser', newValue.toString());
  },
});
