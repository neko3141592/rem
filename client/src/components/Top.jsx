import "./style/Top.scss";
import icon from "../images/icon.png";
import { useContext } from "react";
import { Logout, userData } from "../App";
import { NavLink, useNavigate } from "react-router-dom";

const Top = () => {
    const data = useContext(userData);
    const navigate = useNavigate();
    return (
        <div className="top">
            <div className="list">
                <div className="left">
                    <img src={icon} width={"50px"} className="icon"/>
                </div>
                <div className="right">
                {
                    (!data || Object.keys(data).length === 0)?
                    (
                        <>
                            <NavLink to={'/login'}>Login</NavLink>
                        </>
                    ):(
                        <>
                            <NavLink to={'/mypage'} className='user'>
                                {data.email}
                            </NavLink>
                            <NavLink 
                                to={'/home'} 
                                onClick={()=>{
                                    Logout();  
                                    navigate('/home');
                                    window.location.reload();
                                }}
                            >
                                Logout
                            </NavLink>
                        </>
                    )
                }
                </div>
            </div>
        </div>
    );
}

export default Top;