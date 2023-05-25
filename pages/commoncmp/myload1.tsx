import React, { Fragment } from "react";
import ReactLoading from "react-loading";
const Loader1 = ({ type, color }: any) => (
    <Fragment>
        <div className="loader" style={{ display: "flex", top: "70%", right: "50%", position: "relative" }} >
            <ReactLoading
                type={"spin"}
                color={"#ff4500"}
                height={80}
                width={80}
                className="loadingcss"
            />
        </div>
    </Fragment>
);
export default Loader1;
