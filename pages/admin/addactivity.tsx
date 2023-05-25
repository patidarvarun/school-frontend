import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  CardContent,
  Switch,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import MiniDrawer from "../sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "@emotion/styled";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import {
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";

import { useRouter } from "next/router";
import { api_url, auth_token, qatar_currency } from "../../helper/config";
import { GridCloseIcon } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import dynamic from "next/dynamic";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MainFooter from "../commoncmp/mainfooter";
import commmonfunctions from "../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../helper/activityLogs";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

//dialog box
const BootstrapDialog = styled(Dialog)(({ theme }) => ({}));
export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <GridCloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
  name1: string;
  type1: string;
  description: string;
  price1: number;
  startDate1: string;
  endDate1: string;
  status1: statusEnum;
};
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

export default function AddNewActivity() {
  const [spinner, setshowspinner] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [type1, setType1] = useState<FormValues | any>("");
  const [name1, setName1] = useState<FormValues | any>("");
  const [price1, setPrice1] = useState<FormValues | any>("");
  const [typeError, setTypeError] = useState<FormValues | any>("");
  const [status1, setStatus1] = useState<FormValues | any>(null);
  const [startDate1, setStartDate1] = useState<FormValues | any>(null);
  const [dateError, setDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  const [endDate1, setEndDate1] = useState(null);
  const [content, setContent] = useState("");
  const [descontent, setDesContent] = useState("");
  const [userUniqueId, setUserUniqId] = React.useState<any>();



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();

  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then(res => {
      setUserUniqId(res?.id)
    });
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (startDate1 === null || endDate1 === null) {
      setDateError(true);
      setEndDateError(true);
    } else {
      const sDate = moment(startDate1).format("YYYY.MM.DD");
      const eDate = moment(endDate1).format("YYYY.MM.DD");
      if (type1 === "") {
        setTypeError("Type field is required!");
      } else {
        setTypeError("");
      }
      setshowspinner(true);
      const reqData = {
        name: name1,
        type: type1,
        startdate: sDate,
        enddate: eDate,
        status: data.status1,
        price: price1 && price1 !== null ? price1 : "00",
        short_description: content,
        description: descontent,
      };
      await axios({
        method: "POST",
        url: `${api_url}/addactivity`,
        data: reqData,
        headers: {
          Authorization: auth_token,
          "content-type": "multipart/form-data",
        },
      })
        .then((data) => {
          if (data.status === 201) {
            AddLogs(userUniqueId, `Activity Added id - #${(data?.data?.itemid)}`);
            toast.success("Activity Added Successfully");
            setshowspinner(false);
            setTimeout(() => {
              router.push("/admin/activitylist");
            }, 1000);
          }
        })
        .catch((err) => {
          router.push("/admin/activitylist");
          setshowspinner(false);
          toast.error(err?.response?.data?.message);
        });
    }
  };

  const style = {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const handleType = (data: any) => {
    if (data) {
      setType1(data);
      setTypeError("");
    } else {
      setTypeError("Type field is required");
    }
  };

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
                  ADD ACTIVITY
                </Typography>
              </Stack>
              <div className="buycss" style={{ textAlign: "end" }}>
                <Link
                  href="/admin/activitylist"
                  style={{ color: "#1A70C5", textDecoration: "none" }}
                >
                  <Button variant="contained" startIcon={<ArrowBackIcon />}>
                    {" "}
                    Back To List
                  </Button>
                </Link>
              </div>
            </Stack>
            <Card
              style={{
                margin: "10px",
                padding: "15px",
                width: "60%",
                paddingBottom: "30px",
              }}
              className="box-shadow"
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid>
                  <Stack style={{ marginTop: "10px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">
                            Activity Name <span className="err_str">*</span>
                          </InputLabel>
                          <OutlinedInput
                            type="text"
                            id="name1"
                            placeholder="Activity name ..."
                            fullWidth
                            size="small"
                            {...register("name1", {
                              required: "Activity name is Required *",
                            })}
                            onChange={(e) => setName1(e.target.value)}
                          />

                          {errors.name1?.type && (
                            <span style={style}>
                              {name1 === ""
                                ? " Activity name is Required *"
                                : ""}
                            </span>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack style={{ marginTop: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">
                            Type <span className="err_str">*</span>
                          </InputLabel>
                          <Select
                            defaultValue="none"
                            value={type1}
                            id="type1"
                            labelId="demo-select-small"
                            label="Type"
                            {...register("type1", {
                              required: "Type is Required *",
                            })}
                            onChange={(e) => handleType(e.target.value)}
                          >
                            <MenuItem value="Free">Free</MenuItem>
                            <MenuItem value="Paid">Paid</MenuItem>
                          </Select>
                          {errors.type1?.type && (
                            <span style={style}>
                              {type1 === "" ? errors?.type1?.message : ""}
                            </span>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">
                            Status <span className="err_str">*</span>
                          </InputLabel>
                          <Select
                            defaultValue="none"
                            value={status1}
                            labelId="demo-select-small"
                            id="status1"
                            label="Status"
                            {...register("status1", {
                              required: "Status is Required *",
                            })}
                            onChange={(e) => setStatus1(e.target.value)}
                          >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Draft">Draft</MenuItem>
                            <MenuItem value="Archive">Archive</MenuItem>
                          </Select>
                          {errors.status1?.type && (
                            <span style={style}>
                              {status1 === null ? errors?.status1?.message : ""}
                            </span>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack style={{ marginTop: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">
                            Start Date <span className="err_str">*</span>
                          </InputLabel>
                          <DatePicker
                            className="myDatePicker"
                            id="startDate1"
                            selected={startDate1}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Start Date"
                            // {...register("startDate1", {required: "Start Date is Required *"})}
                            onChange={(date: any) => setStartDate1(date)}
                          />
                          {errors?.name1?.message !== undefined ||
                            errors?.type1?.message !== undefined ||
                            errors?.status1?.message !== undefined ||
                            dateError === true ? (
                            <span style={style}>
                              {startDate1 === null
                                ? "Start Date is Required *"
                                : ""}
                            </span>
                          ) : (
                            ""
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">
                            End Date <span className="err_str">*</span>
                          </InputLabel>
                          <DatePicker
                            className="myDatePicker"
                            selected={endDate1}
                            id="endDate1"
                            dateFormat="MM/dd/yyyy"
                            placeholderText="End Date"
                            minDate={startDate1}
                            // {...register("endDate1", {
                            //   required: "End Date is Required *",
                            // })}
                            onChange={(date: any) => setEndDate1(date)}
                          />
                          {errors?.name1?.message !== undefined ||
                            errors?.type1?.message !== undefined ||
                            errors?.status1?.message !== undefined ||
                            endDateError === true ? (
                            <span style={style}>
                              {endDate1 === null
                                ? "End Date is Required *"
                                : ""}
                            </span>
                          ) : (
                            ""
                          )}
                          {/* {errors.endDate1?.type &&  <span style={style}>{endDate1 === null ? "End Date is Required *" : ""}</span>} */}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                  {(type1 && type1 === "Paid") || type1 === "" ? (
                    <Stack style={{ marginTop: "20px" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="name">
                              Amount <span className="err_str">*</span>
                            </InputLabel>
                            <OutlinedInput
                              type="text"
                              id="price1"
                              placeholder="Amount ..."
                              fullWidth
                              size="small"
                              startAdornment={
                                <InputAdornment position="end">
                                 {" (" + qatar_currency + ")"}
                                </InputAdornment>
                              }
                              {...register("price1", {
                                required: true,
                                pattern: /^[0-9+-]+$/,
                              })}
                              onChange={(e) => setPrice1(e.target.value)}
                            />
                            {errors.price1?.type === "required" && (
                              <span style={style}>
                                {price1 === "" ? "Amount is Required *" : ""}
                              </span>
                            )}
                            {errors.price1?.type === "pattern" && (
                              <span style={style}>Enter Valid Amount *</span>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </Stack>
                  ) : (
                    ""
                  )}
                  <Stack style={{ marginTop: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12}>
                        <Stack spacing={5}>
                          <InputLabel htmlFor="name">
                            Short Description<span className="err_str"></span>
                          </InputLabel>
                          <QuillNoSSRWrapper
                            modules={modules}
                            formats={formats}
                            theme="snow"
                            onChange={setContent}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack style={{ marginTop: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">
                            Description<span className="err_str"></span>
                          </InputLabel>
                          <QuillNoSSRWrapper
                            modules={modules}
                            formats={formats}
                            theme="snow"
                            onChange={setDesContent}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    sx={{ width: 150, marginTop: 5 }}
                    autoFocus
                    disabled={btnDisabled}
                  >
                    <b>Save</b>
                    <span style={{ fontSize: "2px", paddingLeft: "10px" }}>
                      {spinner === true ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        ""
                      )}
                    </span>
                  </Button>
                </Grid>
              </form>
            </Card>
          </div>
          <MainFooter />
        </Box>
      </Box>
      <ToastContainer />
    </>
  );
}
