import React, { useState } from "react";
import Top from "./Top";
import './style/Add.scss';
import { useForm } from 'react-hook-form';

const Add = () => {
    const {register , handleSubmit , formState:{errors} } = useForm();
    const onSubmit = (data) => {
        console.log(data);
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
                    {...register("date", {required:"期限は必須です"})}
                />
                <p className="error">{errors.date?.message}</p>
                <h2>説明</h2>
                <textarea 
                    className="input-exp" 
                    placeholder="説明を追加"
                    {...register("exp")}
                />
                <button onClick={handleSubmit(onSubmit)}>完了</button>
            </div>
        </div>
    );
}

export default Add;