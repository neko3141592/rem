import "./style/Top.scss";
import icon from "../images/icon.png";

const Top = () => {
    return (
        <div className="top">
            <img src={icon} width={"50px"} className="icon"/>
            <div className="list">
                <p className="start">Get start</p>
            </div>
        </div>
    );
}

export default Top;