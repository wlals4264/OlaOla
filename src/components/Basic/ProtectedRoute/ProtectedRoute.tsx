import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoginUserState } from '../../../datas/recoilData';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLoginUser = useRecoilValue(isLoginUserState);

  // 로그인 상태가 아니면 리다이렉트
  if (!isLoginUser) {
    return <Navigate to="/" replace />;
  }

  // 로그인 상태라면 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
