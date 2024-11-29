import { useContext, useEffect, useState } from "react";
import Top from "./Top";
import './style/MyPage.scss';
import { useNavigate } from "react-router-dom";
import { userData } from "../App";
import  Axios  from "axios";
import { base } from "../BaseUrl";
import Footer from "./Footer";

const MyPage = () => {
    const navigate = useNavigate();
    const [printData , setPrintData] = useState(null);
    const userdata = useContext(userData);
    const [searchData , setSearchData] = useState({
        tag:"all",
    });
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
    useEffect(() => {
        console.log(searchData);
        if (!userData) {
            return;
        }
        Axios.get(`${base}/api/print/get/${userdata.email}`, {
            params: {
                tag: (searchData.tag === '全て' ? "all" : searchData.tag),
            },
        })
        .then((res) => {
            setPrintData(res);
        })
        .catch((error) => {

        });
        
    } , [userData, searchData]);
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
                <div className="search">
                <select 
                    className="submit"
                    onChange={(e) => {
                        setSearchData((prevState) => ({
                            ...prevState,
                            tag: e.target.value,
                        }));
                    }}
                >
                    <option>全て</option>
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
                </div>
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