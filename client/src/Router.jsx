import React from "react";
import { BrowserRouter , Route , Routes } from "react-router-dom";

//components
import Home from "./components/Home";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;