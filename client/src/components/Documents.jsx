import { useContext, useEffect, useState } from "react";
import Top from "./Top";
import './style/Documents.scss';
import Axios from 'axios';
import { base } from "../BaseUrl";
import { userData } from "../App";
import { useNavigate, useParams } from "react-router-dom";

const Documents = () =>{
    const userdata = useContext(userData);
    const navigate = useNavigate();
    const { id } = useParams();
    const [docData , setDocData] = useState();
    const formatDateWithTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, 
        });
    };
    const handleDelete = () => {
        Axios.delete(`${base}/api/print/delete/docs/${userdata.email}`, {
            params: {
                id:id,
            }
        })
        .then((res) => {
            navigate('/mypage');
        })
        .catch((error) => {
            console.log(error);
        });
    }
    useEffect(() => {
        if(!id || !userData) {
            return;
        }
        Axios.get(`${base}/api/print/get/docs/${userdata.email}` , {
            params: {
                id:id,
            }
        })
        .then((res) => {
            setDocData(res.data);
        })
        .catch((error) => {
            console.log(error);
        })
    } , [id , userData]);
    return (
        <>
            <Top/>
            <div className="documents">
            {docData ? (
                <>
                    <div className="item-heads">
                        <p className="tag head-items">{docData?.tag}</p>
                        {(docData?.submit1)?(<p className="submit1 head-items">保護者</p>):("")}
                        {(docData?.submit2)?(<p className="submit2 head-items">先生</p>):("")}
                    </div>
                    <div className="title">
                        <h1>{docData?.title}</h1>
                    </div>
                    <h2 className="date">期限: <span>{formatDateWithTime(docData?.date)}</span></h2>
                    <div className="exp">
                        <p>説明:</p>
                        <p>{docData?.exp}</p>
                    </div>
                    
                    <button onClick={()=>{handleDelete()}}>
                        この予定を削除
                    </button>
                </>
            ) : (
                <p>データがありません</p>
            )
            }
            </div>
        </>
    );
}

export default Documents;