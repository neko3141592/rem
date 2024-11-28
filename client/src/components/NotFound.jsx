import React from "react";
import Top from "./Top";
import './style/NotFound.scss';

const NotFound = () => {
    return (
        <div className="not-found">
            <Top/>
            <div className="content">
                <h1>404 Not Found</h1>
                <h2>お探しのページは見つかりませんでした</h2>
            </div>
        </div>
    );
}

export default NotFound;