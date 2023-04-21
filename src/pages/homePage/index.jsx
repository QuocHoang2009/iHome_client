import { Route } from "react-router";
import { Routes } from "react-router-dom";
import EditPage from "./pages/editPage";
import MainPage from "./pages/mainPage";

const HomePage = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/edit" element={<EditPage />} />
    </Routes>
  );
};

export default HomePage;
