import { useContext, useEffect, useState } from "react";
import Top from "./Top";
import './style/MyPage.scss';
import { useNavigate } from "react-router-dom";
import { userData } from "../App";
import  Axios  from "axios";
import { base } from "../BaseUrl";

const MyPage = () => {
    const navigate = useNavigate();
    const [printData , setPrintData] = useState(null);
    const userdata = useContext(userData);
    const formatDateWithTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24時間形式
        });
    };
    useEffect(() => {
        if (!userData) {
            return;
        }
        Axios.get(`${base}/api/print/get/${userdata.email}`)
        .then((res) => {
            setPrintData(res);
        })
        .catch((error) => {

        });
        
    } , [userData]);
    return (
        <>
            <Top/>
            <div className="mypage">
                <div className="title">
                    <h1>今後の予定</h1>
                </div>
                <button 
                    className="plus-button" 
                    onClick={()=>{navigate('add')}}
                >
                    <span className="dli-plus"></span>
                </button>
                <div>
                    {printData?.data ? (
                            Array.isArray(printData.data) ? (
                                printData.data.map((item) => (
                                    <div key={item.id} className="item">
                                        <div className="item-heads">
                                            <p className="tag head-items">{item.tag}</p>
                                            {(item.submit1)?(<p className="submit2 head-items">保護者</p>):("")}
                                            {(item.submit2)?(<p className="submit2 head-items">先生</p>):("")}
                                        </div>
                                        
                                        <h2>{item.title}</h2>
                                        <p className="date">期限: <span>{formatDateWithTime(item.date)}</span></p>
                                        <p>{item.exp}</p>
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <h2>{printData.data.title}</h2>
                                    <p>{printData.data.date}</p>
                                    <p>{printData.data.exp}</p>
                                    <p>{printData.data.submit1}</p>
                                    <p>{printData.data.submit2}</p>
                                    <p>{printData.data.tag}</p>
                                </div>
                            )
                        ) : (
                            <p>データがありません</p>
                        )}
                </div>
            </div>
        </>
    );
}

export default MyPage;