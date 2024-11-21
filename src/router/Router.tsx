import { Routes, Route } from 'react-router-dom';
import StartPage from '../pages/StartPage';
import { MyFeed } from '../pages/MyFeed';
// import LoginPage from "../pages/LoginPage";
// import JoinPage from "../pages/JoinPage";
// import MemberPage from "../pages/MemberPage";
// import SocialJoinPage from "../pages/SocialJoinPage";

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />}></Route>
      <Route path="/myfeed" element={<MyFeed />}></Route>
    </Routes>
  );
};

export default Router;
