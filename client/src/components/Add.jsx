import React from "react";
import Top from "./Top";
import './style/Add.scss';

const Add = () => {
    return (
        <div className="add">
            <Top/>
            <div className="content">
                <div className="title">
                    <h1>予定の追加</h1>
                </div>
                <h2>タイトル</h2>
                <input type="text" className="input-title" placeholder="タイトルを入力"/>
                <h2>期限</h2>
                <input type="date" className="input-date"/>
                <h2>説明</h2>
                <textarea className="input-exp" placeholder="説明を追加"></textarea>
                <button>完了</button>
            </div>
        </div>
    );
}

export default Add;