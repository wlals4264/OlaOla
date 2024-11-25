// 유효성 검사 함수들
export const validateEmail = (email: string): string | null => {
  const validEmail = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  if (!email) {
    return '이메일을 입력해주세요.';
  } else if (!validEmail.test(email)) {
    return '이메일 형식이 올바르지 않습니다.';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  const validPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!password) {
    return '비밀번호를 입력해주세요.';
  } else if (!validPassword.test(password)) {
    return '비밀번호는 8자 이상, 숫자, 특수문자, 영문을 조합하여야 합니다.';
  }
  return null;
};

export const validatePasswordConfirm = (password: string, passwordConfirm: string): string | null => {
  if (!passwordConfirm) {
    return '비밀번호 확인을 입력해주세요.';
  } else if (password !== passwordConfirm) {
    return '비밀번호가 일치하지 않습니다.';
  }
  return null;
};

export const validateNickname = (nickname: string): string | null => {
  if (!nickname) {
    return '닉네임을 입력해주세요.';
  }
  return null;
};

export const handleValidation = (
  value: string,
  validator: (input: string) => string | null,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (value) {
    setError(validator(value));
  } else {
    setError(null);
  }
};
