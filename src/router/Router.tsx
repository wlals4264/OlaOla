import { Routes, Route } from 'react-router-dom';
import StartPage from '../pages/StartPage';
// import LoginPage from "../pages/LoginPage";
// import JoinPage from "../pages/JoinPage";
// import MemberPage from "../pages/MemberPage";
// import SocialJoinPage from "../pages/SocialJoinPage";

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />}></Route>
      {/* <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/join" element={<JoinPage />}></Route>
      <Route path="/login/makeAccount" element={<SocialJoinPage />}></Route>
      <Route path="/memberPage" element={<MemberPage />}></Route> */}
    </Routes>
  );
};

export default Router;
