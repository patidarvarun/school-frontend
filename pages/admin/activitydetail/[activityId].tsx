import {
  Card,
  Button,
  Breadcrumbs,
  Box,
  styled,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { BsTelegram } from "react-icons/bs";
import { Grid, InputLabel, Stack } from "@mui/material";
import Modal from "@mui/material/Modal";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { api_url, auth_token, base_url, qatar_currency } from "../../../helper/config";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import MenuItem from "@mui/material/MenuItem";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Paper from "@mui/material/Paper";
import MiniDrawer from "../../sidebar";
import { useRouter } from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainFooter from "../../commoncmp/mainfooter";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
enum typeEnum {
  Free = "Free",
  Paid = "Paid",
}

enum statusEnum {
  Active = "Active",
  Archive = "Archive",
  Draft = "Draft",
}
type FormValues = {
  name: string;
  type: typeEnum;
  image: any;
  short_description: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  status: statusEnum;
  startDates: string;
};
type HTMLData = {
  content: { "mycustom-html": string };
};
export default function Guardians() {
  let localUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [activity, setActivity] = useState<FormValues | any>("");
  const [htmlData, setHtmlData] = useState<HTMLData>({
    content: { "mycustom-html": "<p>demo</p>" },
  });
  const router = useRouter();
  const { activityId } = router.query;
  const getActivityDetail = async () => {
    try {
      const response = await fetch(
        `${api_url}/getactivitydetails/${activityId}`,
        {
          method: "GET",
          headers: {
            Authorization: auth_token,
          },
        }
      );
      const res = await response.json();

      setActivity(res.data);
      setHtmlData(res.data[0].description);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getActivityDetail();
  }, []);
  let data = "<h1>hello</h1>";

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MiniDrawer />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="guardianBar">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              style={{ padding: "8px", marginBottom: "15px" }}
            >
              <Stack>
                <Stack spacing={3}>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link
                      key="1"
                      color="inherit"
                      href="/"
                      style={{ color: "#1A70C5", textDecoration: "none" }}
                    >
                      Home
                    </Link>
                    <Link
                      key="2"
                      color="inherit"
                      href="/"
                      style={{ color: "#7D86A5", textDecoration: "none" }}
                    >
                      Activities
                    </Link>
                  </Breadcrumbs>
                </Stack>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: "bold", color: "#333333" }}
                >
                  VIEW ACTIVITY
                </Typography>
              </Stack>
              <div className="buycss" style={{ textAlign: "end" }}>
                <Link
                  href="/admin/activitylist"
                  style={{ color: "#1A70C5", textDecoration: "none" }}
                >
                  <Button variant="contained" startIcon={<ArrowBackIcon />}> Back To List</Button>
                </Link>
              </div>
            </Stack>
            <Card
              style={{ margin: "10px", padding: "15px" }}
              className="box-shadow"
            >
              <div className="view-main">
                <div className="view-mainleft">
                  <span
                    className="title view-activity"
                    style={{ fontSize: "40px" }}
                  >
                    {activity[0]?.name}
                  </span>
                  <div className="date" style={{ display: "flex" }}>
                    <div className="sdiv">
                      <h4>
                        <span>startDate : </span>{moment(activity[0]?.startDate, "YYYY.MM.DD").format("DD-MM-YYYY")}
                      </h4>
                    </div>
                    <div className="sdiv">
                      - &nbsp;<h4>
                        <span>endDate : </span>{moment(activity[0]?.endDate, "YYYY.MM.DD").format("DD-MM-YYYY")}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="view-mainright">
                  {activity[0]?.price === 0 ? (
                    <div style={{ marginLeft: "55%" }}>
                      <h4 style={{ color: "#395ba9" }}>Free</h4>
                    </div>
                  ) : (
                    <div>
                      <h4>Amount</h4>
                      <h3 style={{ color: "#395ba9" }}>
                        {activity[0]?.price}{" (" + qatar_currency + ")"}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
              {/* <p>{activity[0]?.description}</p>  */}
              <div
                dangerouslySetInnerHTML={{
                  __html: activity[0]?.description,
                }}
              ></div>
              <div
                className="font-size-15"
                dangerouslySetInnerHTML={{
                  __html: activity[0]?.short_description,
                }}
              ></div>
              <br />

            </Card>
          </div>
          <MainFooter />
        </Box>
      </Box>
    </>
  );
}
