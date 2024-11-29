import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./style/Login.scss";
import Top from "./Top";
import { auth, provider } from "../firebase";
import { useState } from "react";


const Login = () => {
    const navigate = useNavigate();
    const [errState , setErrState] = useState(false);
    const signinWithGoogle = () => {
        signInWithPopup(auth, provider)
        .then((res) => {
            navigate('/mypage');
            window.location.reload();
        })
        .catch((error) => {
            setErrState(true);
        })
    }
    return (
        <div className="login">
            <Top/>
            <div className="content">
                <h1>Rem-docsにログイン</h1>
                <button onClick={signinWithGoogle}>Googleで続ける</button>
                <p className="error">
                { errState ? 
                    (
                        <>エラーが発生しました</>
                    ) : (
                        <></>
                    )
                }
                </p>
            </div>
        </div>
    );
}

export default Login;