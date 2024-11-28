import React, { useContext } from "react";
import { BrowserRouter , Route , Routes } from "react-router-dom";


//components
import Home from "./components/Home";
import Login from "./components/Login";
import MyPage from "./components/MyPage";
import Add from "./components/Add";
import { userData } from "./App";
import NotFound from "./components/NotFound";

const Router = () => {
    const data = useContext(userData);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                {
                    (!data || Object.keys(data).length === 0)?
                (
                    <>
                        
                    </>
                ): (
                    <>
                        <Route path="/mypage" element={<MyPage/>}/>
                        <Route path="/mypage/add" element={<Add/>}/>
                    </>
                )
                }
                <Route path="/*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;