import Top from "./Top";
import './style/MyPage.scss';
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();
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
            </div>
        </>
    );
}

export default MyPage;