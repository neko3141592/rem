import "./style/Home.scss";
import Top from "./Top";

const Home = () => {
    
    return (
        <div className="home">
            <Top />
            <div className="content">
                <h1 className="title">Rem-docs</h1>
                <h2 className="sub-title">究極のプリント管理システム</h2>
                <div className="buttons" >
                    <button onClick={()=>{}} className="login">Login</button>
                    <button onClick={()=>{}} className="start">Registar</button>
                </div>
            </div>
        </div>
    );
}

export default Home;