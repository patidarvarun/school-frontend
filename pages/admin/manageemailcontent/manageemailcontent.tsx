import React, { useState } from "react";
import {
    Card,
    Box,
    Typography,
    Stack,
    Breadcrumbs,
    FormControl,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    BoxProps,
    Button,
} from "@mui/material";
import Link from "next/link";
import MiniDrawer from "../../sidebar";
import { TextField } from "@mui/material";
import { useRouter } from "next/router";
import { api_url, auth_token } from "../../../helper/config";
import "react-datepicker/dist/react-datepicker.css";
import MainFooter from "../../commoncmp/mainfooter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import Loader from "../../commoncmp/myload";
import Image from "next/image";

function Item(props: BoxProps) {
    const { sx, ...other } = props;
    return <Box sx={{}} {...other} />;
}

export default function ManageEmailContent() {
    const router = useRouter();
    const [roleid, setroleid] = useState(0);
    const [emailtemp, setemailtemp] = useState<any>([]);
    const [all, setall] = useState(0);
    const [searchdata, setsearchdata] = useState<any>([]);
    const [searchquery, setsearchquery] = useState("");
    const [myloadar, setmyloadar] = React.useState(true);
    setTimeout(() => {
        setmyloadar(false);
    }, 1500);
    React.useEffect(() => {
        commmonfunctions.GivenPermition().then(res => {
            setroleid(res.roleId);
            if (res.roleId == 1) {
            } else if (res.roleId > 1 && res.roleId !== 2) {
                commmonfunctions.ManageComposers().then(res => {
                    if (!res) {
                        router.push("/userprofile");
                    }
                })
            }
        });
        getEmailTemplate();
    }, []);
    //get email templates 
    const getEmailTemplate = async () => {
        const url = `${api_url}/getemailtemplate`;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: auth_token,
                },
            });
            const res = await response.json();
            setemailtemp(res?.data);
            setsearchdata(res?.data);
            setall(res?.data?.length)
        } catch (error) {
            console.log("error", error);
        }
    };
    // apply searching
    const handleSearch = (e: any) => {
        setsearchquery(e.target.value);
        if (e.target.value === "") {
            setemailtemp(searchdata);
        } else {
            const filterres = searchdata.filter((item: any) => {
                return (
                    item?.templatename
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                    item?.enailsubject
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                    item?.emailtype
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase())
                );
            });
            const dtd = filterres;
            setemailtemp(dtd);
        }
    };

    const AddEmailCont = () => {
        router.push("/admin/manageemailcontent/addemailcontent");
    }
    return (
        <>
            {
                myloadar ? (
                    <Loader />
                ) : roleid === 1 || roleid !== 2 ? (<Box sx={{ display: "flex" }}>
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
                                                href="/admin/manageemailcontent/manageemailcontent"
                                                style={{ color: "#7D86A5", textDecoration: "none" }}
                                            >
                                                Manage Email Content
                                            </Link>
                                        </Breadcrumbs>
                                    </Stack>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        style={{ fontWeight: "bold", color: "#333333" }}
                                    >
                                        MANAGE EMAIL CONTENT
                                    </Typography>
                                </Stack>
                                {/* <Button
                                    className="button-new"
                                    variant="contained"
                                    size="small"
                                    sx={{ width: 150 }}
                                    onClick={AddEmailCont}
                                >
                                    <b>Add Email Cont.</b>
                                </Button> */}
                            </Stack>
                            <Card
                                style={{ margin: "10px", padding: "15px" }}
                                className="box-shadow"
                            >
                                <TableContainer>
                                    {/*bread cump */}
                                    <Stack
                                        style={{ marginBottom: "10px" }}
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Box
                                            className="filter-list"
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                bgcolor: "background.paper",
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Item className="filter-active"><b>ALL ({all})</b></Item>
                                        </Box>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            className="fimport-export-box"
                                        >
                                            <FormControl>
                                                <TextField
                                                    placeholder="Search..."
                                                    size="small"
                                                    value={searchquery}
                                                    type="search"
                                                    onInput={(e) => handleSearch(e)}
                                                    style={{ width: "300px" }}
                                                />
                                            </FormControl>
                                        </Stack>
                                    </Stack>
                                    {/*bread cump */}
                                    <Table style={{ marginTop: "20px" }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography>SR. NO.</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>E-Mail Template Name</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>E-Mail Subject Text</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>E-Mail Type</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>Status</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>Action</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {emailtemp && emailtemp ? (
                                                emailtemp.map((item: any, key: any) => (
                                                    <TableRow
                                                        hover
                                                        tabIndex={-1}
                                                        role="checkbox"

                                                        className="boder-bottom"
                                                    >
                                                        <TableCell align="left">{key + 1}</TableCell>
                                                        <TableCell align="left">{item?.templatename
                                                        }</TableCell>
                                                        <TableCell align="left">{item?.enailsubject}</TableCell>
                                                        <TableCell align="left">{item?.emailtype}</TableCell>
                                                        <TableCell align="left">
                                                            <Stack
                                                                className="action"
                                                                direction="row"
                                                                spacing={1}
                                                            >
                                                                {item.status === 1 ? (
                                                                    <span
                                                                        style={{
                                                                            color: "#02C509",
                                                                        }}
                                                                    >
                                                                        ACTIVE
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        style={{
                                                                            color: "#FF4026",
                                                                        }}
                                                                    >
                                                                        INACTIVE
                                                                    </span>
                                                                )}
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Button className="idiv">
                                                                <Link
                                                                    href={`/admin/manageemailcontent/updateEmailcontent/${item?.id}`}
                                                                >
                                                                    <Image
                                                                        src="/edit.svg"
                                                                        alt="Edit Invoice"
                                                                        title="Edit Invoice"
                                                                        width={35}
                                                                        height={35}
                                                                    />
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <h3>No Record found</h3>
                                            )}
                                        </TableBody>
                                    </Table>
                                    {emailtemp == "" ? <h3>No Record found</h3> : ""}
                                </TableContainer>
                            </Card>
                        </div>
                        <MainFooter />
                        <ToastContainer />
                    </Box>
                </Box>) : ""}
        </>
    );
}
