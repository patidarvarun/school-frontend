import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

const AuthRightTemplate = () => {
  return (
    <Box
      sx={{
        height: 400,
        width: 450,
      }}
      style={{ marginLeft: "20%" }}
    >
      <Stack>
        <Typography
          style={{
            fontSize: "40px",
            fontWeight: "900",
            color: "#333333",
            lineHeight: "46px",
          }}
        >
          WELCOME
          <span style={{ color: "#42D5CD" }}> QATAR,</span>
        </Typography>
        <Typography style={{ fontSize: "25px", fontWeight: "900" }}>
          CUSTOMER SELF SERVICE
        </Typography>
      </Stack>
      <Stack>
        <Typography style={{ fontSize: "14px", marginTop: "10px" }}>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration.
        </Typography>
        <FormGroup style={{ marginTop: "10px" }}>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            //label="Lorem Ipsum is simply dummy text of the printing"
            label={
              <Box component="div" fontSize={14}>
                Lorem Ipsum is simply dummy text of the printing
              </Box>
            }
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            //label="When an unknown printer took a galley of type and scrambled"
            label={
              <Box component="div" fontSize={14}>
                When an unknown printer took a galley of type and scrambled
              </Box>
            }
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            //label="It was popularised in the 1960s with the"
            label={
              <Box component="div" fontSize={14}>
                It was popularised in the 1960s with the
              </Box>
            }
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            //label="Lorem Ipsum is simply dummy text of the printing"
            label={
              <Box component="div" fontSize={14}>
                Lorem Ipsum is simply dummy text of the printing
              </Box>
            }
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            //label="When an unknown printer took a galley of type and scrambled"
            label={
              <Box component="div" fontSize={14}>
                When an unknown printer took a galley of type and scrambled
              </Box>
            }
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            //label="It was popularised in the 1960s with the"
            label={
              <Box component="div" fontSize={14}>
                It was popularised in the 1960s with the
              </Box>
            }
          />
        </FormGroup>
      </Stack>
    </Box>
  );
};
export default AuthRightTemplate;
