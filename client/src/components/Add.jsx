import React, { useContext, useState } from "react";
import Top from "./Top";
import './style/Add.scss';
import { useForm } from 'react-hook-form';
import { userData } from "../App";
import Axios from 'axios';

const Add = () => {
    const userdata = useContext(userData);
    const {register , handleSubmit , formState:{errors} } = useForm({mode:"onBlur"});
    const onSubmit = (data) => {
        console.log(data);
        const sendData = {
            user:userdata.email,
            title:data.title,
            date:data.date,
            submit1: (data.submit1 === "あり"? true : false),
            submit2: (data.submit2 === "あり"? true : false),
            tag: data.tag,
        }
        const url = "";
        Axios.post(url , sendData , {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer `,
            }
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
                    type="date" 
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
                    <option>数学</option>
                    <option>数学A</option>
                    <option>数学B</option>
                    <option>数学ⅠA</option>
                    <option>数学ⅡB</option>
                    <option>数学ⅢC</option>
                    <option>英語</option>
                    <option>英語Ⅰ</option>
                    <option>英語Ⅱ</option>
                    <option>英会話</option>
                    <option>英文法</option>
                    <option>国語</option>
                    <option>国語A</option>
                    <option>国語B</option>
                    <option>理科</option>
                    <option>理科Ⅰ</option>
                    <option>理科Ⅱ</option>
                </select>
                <button onClick={handleSubmit(onSubmit)}>完了</button>
            </div>
        </div>
    );
}

export default Add;