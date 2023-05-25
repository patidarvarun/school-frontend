import React, { Fragment } from "react";
import ReactLoading from "react-loading";
const Loader = ({ type, color }: any) => (
    <Fragment>
        <div style={{ display: "flex", top: "50%", right: "50%" }}>
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
export default Loader;