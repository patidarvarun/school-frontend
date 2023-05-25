import { Typography } from "@mui/material";
import React from "react";
import { RiTwitterLine } from "react-icons/ri";
import { RxInstagramLogo } from "react-icons/rx";
import { SlSocialFacebook } from "react-icons/sl";

export default function Footer() {
  return (
    <footer>
      <Typography style={{ fontSize: "15px" }}>
        © 2023 QIS. All Rights Reserved{" "}
        {/* <a href="http://www.polymer-project.org/" target="_blank">
          <SlSocialFacebook />
        </a>
        <a href="http://www.polymer-project.org/" target="_blank">
          <RiTwitterLine />
        </a>
        <a href="http://www.polymer-project.org/" target="_blank">
          <RxInstagramLogo />
        </a> */}
      </Typography>
    </footer>
  );
}
