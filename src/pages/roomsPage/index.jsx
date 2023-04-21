import { Route } from 'react-router';
import { Routes } from "react-router-dom";
import MainPage from "./pages/mainPage";
import RoomPage from "./pages/roomPage";

const RoomsPage = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route path="/:id" element={<RoomPage />}/>
        </Routes>
    )
};

export default RoomsPage;