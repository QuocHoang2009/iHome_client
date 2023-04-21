import { Route } from 'react-router';
import { Routes } from "react-router-dom";
import DevicePage from "./pages/devicePage";
import MainPage from "./pages/mainPage";

const DevicesPage = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route path="/:id" element={<DevicePage />}/>
        </Routes>
    )
};

export default DevicesPage;