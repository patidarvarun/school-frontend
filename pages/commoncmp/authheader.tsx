import { IconButton } from "@mui/material";
import React from "react";

const AuthHeader = () => {
  return (
    <>
      <header className="header-navbar1" >
        <IconButton size="large" edge="start" sx={{ background: "none",justifyContent:'center'}}>
          <img src="/svg-icon/svgicon.png" />
        </IconButton>
      </header>
      {/* <header className="header-navbar2">
        <IconButton></IconButton>
        <nav className="nav-bar">
          <IconButton size="large" edge="start" sx={{ background: "none",display:{xs:'none'} }}>
            <img src="/svg-icon/Vector.png" />
          </IconButton>
        </nav>
      </header> */}
    </>
  );
};
export default AuthHeader;
