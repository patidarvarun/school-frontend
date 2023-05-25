import React from "react";
import {
    Card,
    Box,
    Typography,
    Stack,
    Breadcrumbs,
    Tabs,
    Tab,
    Grid,
    InputLabel,
    OutlinedInput,
    FormControl,
    Select,
    Button,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import Link from "next/link";
import MiniDrawer from "../../sidebar";
import "react-datepicker/dist/react-datepicker.css";
import MainFooter from "../../commoncmp/mainfooter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import { api_url, auth_token } from "../../../helper/config";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import axios from "axios";
import CodeMirror from '@uiw/react-codemirror';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import AddEmailType from "./addnewemailtype";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});
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
        matchVisual: false,
    },
};
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

type FormValues = {
    emailtname: string,
    emailsname: string,
    emailtype: string,
    othertype: string,
    replytoname: string,
    replytoemail: string,
    cretadeBy: number,
    status: boolean
};

const style = {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold",
};

export default function AddEmailContent() {
    const router = useRouter();
    const [values, setValues] = React.useState(0);
    const [bodytext, setbodytext] = React.useState("");
    const [emailtypes, setemailtypes] = React.useState<any>([]);
    const [emailtype, setemailtype] = React.useState("");
    const [spinner, setshowspinner] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const [createdBy, setcreatedBy] = React.useState<any>(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValues(newValue);
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    React.useEffect(() => {
        getEmailtypes();
        commmonfunctions.VerifyLoginUser().then(res => {
            setcreatedBy(res.id);
        });
    }, []);

    //get email types
    const getEmailtypes = async () => {
        const url = `${api_url}/getemailtypes`;
        try {
            const response = await fetch(url, {
                method: "get",
                headers: {
                    Authorization: auth_token,
                },
            });
            const res = await response.json();
            setemailtypes(res.data);
        } catch (error) {
            console.log("error", error);
        }
    };
    // submit data
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setshowspinner(true);
        setBtnDisabled(true);
        const reqData = {
            templatename: data.emailtname,
            emailtype: emailtype,
            othertype: data.othertype,
            replytoname: data.replytoname,
            replytoemail: data.replytoemail,
            enailsubject: data.emailsname,
            emailbodytext: bodytext,
            createdBy: createdBy
        };
        await axios({
            method: "POST",
            url: `${api_url}/addemailtemplate`,
            data: reqData,
            headers: {
                Authorization: auth_token,
            },
        })
            .then((data) => {
                if (data.status === 200) {
                    setshowspinner(false);
                    setBtnDisabled(false);
                    toast.success("Eamil Template Created Successfully");
                    setTimeout(() => {
                        router.push("/admin/manageemailcontent/manageemailcontent");
                    }, 1500);
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error("Internal server error");
                setshowspinner(false);
                setBtnDisabled(false);
            });
    };

    const [newEmailTypeOpen, setnewEmailTypeOpen] = React.useState(false);
    //open close popup boxes
    function handleNewEmailType() {
        setnewEmailTypeOpen(true);
    }
    const closePoP = (data: any) => {
        setnewEmailTypeOpen(false);
        getEmailtypes();
    };

    const handleEmailType = (data: any) => {
        setemailtype(data);
    };
    return (
        <>
            <Box sx={{ display: "flex" }}>
                <MiniDrawer />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <div className="guardianBar">
                        <form onSubmit={handleSubmit(onSubmit)}>
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
                                                Add Email Content
                                            </Link>
                                        </Breadcrumbs>
                                    </Stack>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        style={{ fontWeight: "bold", color: "#333333" }}
                                    >
                                        ADD EMAIL CONTENT
                                    </Typography>
                                </Stack>
                                <Link
                                    href="/admin/manageemailcontent/manageemailcontent"
                                    style={{ color: "#1A70C5", textDecoration: "none" }}
                                >
                                    <Button variant="contained" startIcon={<ArrowBackIcon />}>
                                        {" "}
                                        <b>Back To List</b>
                                    </Button>
                                </Link>
                            </Stack>
                            <Card
                                style={{ margin: "10px", padding: "15px" }}
                                className="box-shadow"
                            >
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs value={values} onChange={handleChange} aria-label="basic tabs example">
                                            <Tab label="General" {...a11yProps(0)} style={{ marginRight: "330px", fontSize: "18px" }} />
                                            <Tab label="Contents" {...a11yProps(1)} style={{ marginRight: "330px", fontSize: "18px" }} />
                                            <Tab label="Preview" {...a11yProps(2)} style={{ fontSize: "18px" }} />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={values} index={0}>
                                        <Stack style={{ marginTop: "20px" }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={9}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="emailtname">
                                                            E-Mail Template Name <span className="err_str">*</span>
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            type="text"
                                                            id="emailtname"
                                                            fullWidth
                                                            size="small"
                                                            {...register("emailtname", {
                                                                required: true,
                                                                validate: (value) => { return !!value.trim() }
                                                            })}
                                                        />
                                                    </Stack>
                                                    {errors.emailtname?.type === "required" && (
                                                        <span style={style}>Field is Required *</span>
                                                    )}
                                                    {errors.emailtname?.type === "validate" && (
                                                        <span style={style}>Email template can't be blank *</span>
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} md={9}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="emailsname">
                                                            E-Mail Subject <span className="err_str">*</span>
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            type="text"
                                                            id="emailsname"
                                                            fullWidth
                                                            size="small"
                                                            {...register("emailsname", {
                                                                required: true,
                                                                validate: (value) => { return !!value.trim() }
                                                            })}
                                                        />
                                                    </Stack>
                                                    {errors.emailsname?.type === "required" && (
                                                        <span style={style}>Field is Required *</span>
                                                    )}
                                                    {errors.emailsname?.type === "validate" && (
                                                        <span style={style}>Email subject can't be blank *</span>
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} md={9}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="name">
                                                            E-Mail Type <span className="err_str">*</span>
                                                        </InputLabel>
                                                        <FormControl fullWidth>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                size="small"
                                                                {...register("emailtype", {
                                                                    required: "Email type is Required *",
                                                                })}
                                                                value={emailtype}
                                                                onChange={(e) => handleEmailType(e.target.value)}
                                                            >
                                                                <MenuItem value={0} disabled>Select Email Type <span className="err_str">*</span> </MenuItem>
                                                                {emailtypes &&
                                                                    emailtypes.map((data: any, key: any) => {
                                                                        return (
                                                                            <MenuItem id={key} value={data?.emailtypes}>
                                                                                {data?.emailtypes}
                                                                            </MenuItem>
                                                                        );
                                                                    })}
                                                            </Select>
                                                            {errors.emailtype?.type && (
                                                                <span style={style}>
                                                                    {emailtype === "" ? errors?.emailtype?.message : ""}
                                                                </span>
                                                            )}
                                                        </FormControl>
                                                    </Stack>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        md={12}
                                                        style={{ paddingTop: "10px" }}
                                                    >
                                                        <Stack
                                                            style={{ width: "auto", float: "right" }}
                                                            textAlign={"end"}
                                                            onClick={handleNewEmailType}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: "#26CEB3",
                                                                    fontWeight: "bold",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Create New E-Mail Type
                                                            </span>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} md={9} style={{ paddingTop: "0px" }}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="othertype">
                                                            Other Type
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            type="text"
                                                            id="othertype"
                                                            fullWidth
                                                            size="small"
                                                            {...register("othertype")}
                                                        />
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} md={9}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="replytoname">
                                                            Reply To Name <span className="err_str">*</span>
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            type="text"
                                                            id="replytoname"
                                                            fullWidth
                                                            size="small"
                                                            {...register("replytoname", {
                                                                required: true,
                                                                validate: (value) => { return !!value.trim() }
                                                            })}
                                                        />
                                                    </Stack>
                                                    {errors.replytoname?.type === "required" && (
                                                        <span style={style}>Field is Required *</span>
                                                    )}
                                                    {errors.replytoname?.type === "validate" && (
                                                        <span style={style}>Field can't be blank *</span>
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} md={9}>
                                                    <Stack spacing={1}>
                                                        <InputLabel htmlFor="replytoemail">
                                                            Reply To E-Mail <span className="err_str">*</span>
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            type="text"
                                                            id="replytoemail"
                                                            fullWidth
                                                            size="small"
                                                            {...register("replytoemail", {
                                                                required: true,
                                                                validate: (value) => { return !!value.trim() }
                                                            })}
                                                        />
                                                    </Stack>
                                                    {errors.replytoemail?.type === "required" && (
                                                        <span style={style}>Field is Required *</span>
                                                    )}
                                                    {errors.replytoemail?.type === "validate" && (
                                                        <span style={style}>Field can't be blank *</span>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </TabPanel>
                                    <TabPanel value={values} index={1}>
                                        <Stack style={{ marginTop: "10px" }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={12}>
                                                    <Stack spacing={5}>
                                                        {/* <QuillNoSSRWrapper
                                                            modules={modules}
                                                            formats={formats}
                                                            value={bodytext}
                                                            theme="snow"
                                                            onChange={setbodytext}
                                                            style={{ height: "450px", marginBottom: "20px" }}
                                                        /> */}
                                                        <CodeMirror
                                                            height="500px"
                                                            maxWidth="1000px"
                                                            value={bodytext}
                                                            onChange={setbodytext}
                                                            style={{ fontSize: '14px' }}
                                                        />
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </TabPanel>
                                    <TabPanel value={values} index={2}>
                                        <Box style={{ height: "500px", width: "100%", border: "1px solid #ccc", overflow: "auto" }}>
                                            <Typography style={{ padding: "50px" }}>

                                                <div dangerouslySetInnerHTML={{ __html: bodytext }}></div></Typography>
                                        </Box>
                                    </TabPanel>
                                </Box>
                                <Grid item xs={12} style={{ padding: "23px" }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        style={{ width: "200px" }}
                                        disabled={btnDisabled}
                                    >
                                        <b>SAVE</b>
                                        <span
                                            style={{ fontSize: "2px", paddingLeft: "10px" }}
                                        >
                                            {spinner === true ? (
                                                <CircularProgress color="inherit" />
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    </Button>{" "}
                                    <Link
                                        style={{ color: "red", textDecoration: "none" }}
                                        href="/admin/manageemailcontent/manageemailcontent"
                                    >
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            style={{
                                                marginLeft: "30px",
                                                backgroundColor: "#F95A37",
                                                width: "200px"
                                            }}
                                        >
                                            <b>CANCEL</b>
                                        </Button>
                                    </Link>
                                </Grid>
                            </Card>
                        </form>
                    </div>
                    <MainFooter />
                    <ToastContainer />
                </Box>
            </Box >
            {newEmailTypeOpen ? <AddEmailType open={newEmailTypeOpen} closeDialog={closePoP} /> : ""}
        </>
    );
}