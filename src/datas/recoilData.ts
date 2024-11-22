import { atom } from 'recoil';

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
