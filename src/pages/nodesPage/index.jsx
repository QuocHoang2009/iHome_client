import { Route } from 'react-router';
import { Routes } from "react-router-dom";
import MainPage from "./pages/mainPage";
import NodePage from "./pages/nodePage";

const NodesPage = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route path="/:id" element={<NodePage />}/>
        </Routes>
    )
};

export default NodesPage;