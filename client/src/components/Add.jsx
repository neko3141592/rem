import React, { useContext, useState } from "react";
import Top from "./Top";
import './style/Add.scss';
import { useForm } from 'react-hook-form';
import { userData } from "../App";
import Axios from 'axios';
import { base } from "../BaseUrl";
import { useNavigate } from "react-router-dom";

const Add = () => {
    const userdata = useContext(userData);
    const navigate = useNavigate();
    const {register , handleSubmit , formState:{errors} } = useForm({mode:"onBlur"});
    const [serverError , setServerError] = useState(false);
    const onSubmit = (data) => {
        const sendData = {
            user:userdata.email,
            title:data.title,
            date:data.date,
            exp: (!data.exp ? "" : data.exp),
            submit1: (data.submit1 === "あり" ? true : false),
            submit2: (data.submit2 === "あり" ? true : false),
            tag: data.tag,
        }
        Axios.post(`${base}/api/print/create` , sendData , {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer `,
            }
        })
        .then(() => {
            
        })
        .catch((error) => {
            setServerError(true);
        })
    }
    return (
        <div className="add">
            <Top/>
            <div className="content">
                <div className="title">
                    <h1>予定の追加</h1>
                </div>
                <h2 className="required">タイトル</h2>
                <input 
                    type="text" 
                    className="input-title" 
                    placeholder="タイトルを入力"
                    {...register("title", {required:"タイトルは必須です"})}
                />
                <p className="error">{errors.title?.message}</p>
                <h2 className="required">期限</h2>
                <input 
                    type="datetime-local" 
                    className="input-date"
                    {...register("date", {required:"期限は必須です", valueAsDate:true, min: new Date()})}
                />
                <p className="error">{errors.date?.message}</p>
                <h2>説明</h2>
                <textarea 
                    className="input-exp" 
                    placeholder="説明を追加"
                    {...register("exp")}
                />
                <h2 className="required">保護者への提出</h2>
                <select 
                    className="submit"
                    {...register("submit1", {required:"選択してください"})}
                >
                    <option>あり</option>
                    <option>なし</option>
                </select>
                <h2 className="required">先生への提出</h2>
                <select 
                    className="submit"
                    {...register("submit2", {required:"選択してください"})}
                >
                    <option>あり</option>
                    <option>なし</option>
                </select>
                <h2>タグ</h2>
                <select 
                    className="submit"
                    {...register("tag")}
                >
                    <option>なし</option>
                    <option>一般</option>
                    <option>HR</option>
                    <option>数学</option>
                    <option>代数</option>
                    <option>幾何</option>
                    <option>数ⅠA</option>
                    <option>数ⅡB</option>
                    <option>数ⅢC</option>
                    <option>英語</option>
                    <option>英語Ⅰ</option>
                    <option>英語Ⅱ</option>
                    <option>英会話</option>
                    <option>英文法</option>
                    <option>国語</option>
                    <option>現代文</option>
                    <option>古文</option>
                    <option>漢文</option>
                    <option>理科</option>
                    <option>理科Ⅰ</option>
                    <option>理科Ⅱ</option>
                    <option>社会</option>
                    <option>公民</option>
                    <option>地理</option>
                    <option>歴史</option>
                    <option>倫理</option>
                    <option>政経</option>
                    <option>情報</option>
                    <option>音楽</option>
                    <option>美術</option>
                    <option>技術</option>
                    <option>家庭科</option>
                    <option>保健体育</option>
                    <option>その他</option>
                </select>
                <button onClick={handleSubmit(onSubmit)}>完了</button>
                <p className="error">
                {
                    (serverError)?("問題が発生しました"):("")
                }
                </p>
            </div>
        </div>
    );
}

export default Add;