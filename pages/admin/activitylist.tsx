import {
  Card,
  Table,
  Stack,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TableHead,
  Button,
  Breadcrumbs,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Pagination,
  IconButton,
  Tabs,
  Tab,
  Menu,
  Grid,
  InputLabel,
  Modal,
  styled,
} from "@mui/material";
import moment from "moment";
import Box from "@mui/material/Box";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiFilterAlt, BiShow } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Fill, RiFileCopyLine } from "react-icons/ri";
import MiniDrawer from "../sidebar";
import { api_url, auth_token, base_url, qatar_currency } from "../../helper/config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import ConfirmBox from "../commoncmp/confirmbox";
import commmonfunctions from "../../commonFunctions/commmonfunctions";
import MainFooter from "../commoncmp/mainfooter";
import Loader from "../commoncmp/myload";
import { AddLogs } from "../../helper/activityLogs";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
interface StyledTabProps {
  label: string;
  onClick: any;
  className?: any;
}

//pagination function
function usePagination(data: any, itemsPerPage: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);
  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }
  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }
  function jump(page: any) {
    const pageNumber = Math.max(1, page);
    setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
  }
  return { next, prev, jump, currentData, currentPage, maxPage };
}
//filter form values
type FormValues = {
  customerType: number;
  status: number;
};

export default function ActivityList() {
  const [activites, setactivites] = useState<any>([]);
  const [activity, setFullactivites] = useState<any>([]);
  const [searchquery, setsearchquery] = useState("");
  const [searchdata, setsearchdata] = useState([]);
  const [All, setAll] = useState(0);
  const [activityName, setActivityName] = useState("");
  const [Upcommig, setUpcommig] = useState(0);
  const [Past, setPast] = useState(0);
  const [Current, setCurrent] = useState(0);
  const [newActivityOpen, setnewActivityOpen] = React.useState(false);
  const [editActivityOpen, seteditActivityOpen] = React.useState(false);
  const [tabFilterData, settabFilterData] = useState<any>([]);
  const [deleteConfirmBoxOpen, setdeleteConfirmBoxOpen] = React.useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [value, setValue] = React.useState(0);
  const [editid, seteditid] = useState<any>(0);
  const { register, handleSubmit } = useForm<FormValues>();
  const todayDate = moment(new Date()).format("YYYY.MM.DD");
  const [custpermit, setcustpermit] = useState<any>([]);
  const [roleid, setroleid] = useState(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [activeTab, setActiveTab] = useState("");
  const [myload, setmyload] = useState(false);
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [myloadar, setmyloadar] = React.useState(true);
  setTimeout(() => {
    setmyloadar(false);
  }, 1000);

  // verify user login
  let logintoken: any;
  const router = useRouter();
  React.useEffect(() => {
    logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      if (res.roleId == 1) {
        setroleid(res.roleId);
        //router.push("/userprofile");
      } else if (res.roleId > 1 && res.roleId !== 2) {
        commmonfunctions.ManageActivity().then((res) => {
          if (!res) {
            router.push("/userprofile");
          } else {
            setcustpermit(res);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then(res => {
      setUserUniqId(res?.id)
    });
    fetchData();
  }, []);

  //get activites
  const url = `${api_url}/getActivity`;
  const fetchData = async () => {
    try {
      setmyload(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: auth_token,
          "x-access-token": logintoken,
        },
      });
      const json = await response.json();
      setactivites(json.data);
      setFullactivites(json.data);
      setsearchdata(json.data);
      setAll(json.data.length);
      setmyload(false);
    } catch (error: any) {
      console.log("error", error);
      setmyload(false);
    }
  };

  //searching
  const handleSearch = (e: any) => {
    setsearchquery(e.target.value);
    if (e.target.value === "") {
      if (activeTab === "upcoming") {
        setactivites(upcoming);
      } else if (activeTab === "past") {
        setactivites(past);
      } else if (activeTab === "current") {
        setactivites(current);
      } else {
        setactivites(searchdata);
      }
    } else {
      const filterres = searchdata.filter((item: any) => {
        return (
          item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.type.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.status.toLowerCase().includes(e.target.value.toLowerCase()) ||
          `${item.price}`.includes(e.target.value) ||
          moment(item?.startDate, "DD/MM/YYYY")
            .format("ll")
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          moment(item?.endDate, "DD/MM/YYYY")
            .format("ll")
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      const dtd = filterres;
      setactivites(dtd);
    }
  };
  function ResetFilterValue() {
    setFilterType("");
    setFilterStatus("");
    fetchData();
  }
  const filterApply = async (e: any) => {
    e.preventDefault();
    setFullactivites([]);

    const reqData = {
      status: filterStatus,
      type: filterType,
    };

    await axios({
      method: "POST",
      url: `${api_url}/getActivity`,
      data: reqData,
      headers: {
        Authorization: auth_token,
        "x-access-token": logintoken,
      },
    })
      .then((res: any) => {
        if (res.status === 200) {
          setactivites(res?.data?.data);
          setFullactivites(res?.data?.data);
          setsearchdata(res?.data?.data);
          setAll(res?.data?.data.length);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const past = activity?.filter((a: any) => a?.startDate < todayDate);
  const upcoming = activity?.filter((a: any) => a?.startDate > todayDate);
  const current = activity?.filter((a: any) => a?.startDate === todayDate);
  const allListData = activity?.filter((a: any) => a);

  //pagination
  const [row_per_page, set_row_per_page] = useState(5);
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  let [page, setPage] = useState(1);
  const PER_PAGE = row_per_page;
  const count = Math.ceil(activites.length / PER_PAGE);
  const DATA = usePagination(activites, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  //delete user
  const [deleteData, setDeleteData] = useState<any>({});
  function openDelete(data: any) {
    setActivityName(data?.name);
    handleOpen();
    setDeleteData(data);
  }

  function fallbackCopyTextToClipboard(text: any) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  }

  const copyCode = (text: any) => {
    let makeLink = `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/activitydetail/${text?.id}`;
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(makeLink);
      return;
    }
    navigator.clipboard.writeText(makeLink).then(
      function () {
        toast.success("Copied !");
        // console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  // add activity from popup
  function handleNewActivityFormOpen() {
    setnewActivityOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  const handleActivityDelete = async () => {
    await axios({
      method: "DELETE",
      url: `${api_url}/deleteactivity/${deleteData?.id}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data) => {
        AddLogs(userUniqueId, `Delete Activity id - #${(data?.data?.itemid)}`);
        toast.success("Activity Deleted Successfully");
        handleClose();
        fetchData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpcoming = () => {
    setActiveTab("upcoming");
    if (DATA?.currentPage === 1) {
      setactivites(upcoming);
    } else {
      setactivites(upcoming);
      handlePageChange("", 1);
    }
  };

  const handleAll = () => {
    if (DATA?.currentPage === 1) {
      setactivites(allListData);
    } else {
      handlePageChange("", 1);
      setactivites(allListData);
    }
  };

  const handlePast = () => {
    setActiveTab("past");
    if (DATA?.currentPage === 1) {
      setactivites(past);
      // handlePageChange("",1)
    } else {
      setactivites(past);
      handlePageChange("", 1);
    }
  };

  const handleCurrent = () => {
    setActiveTab("current");
    if (DATA?.currentPage === 1) {
      setactivites(current);
    } else {
      setactivites(current);
      handlePageChange("", 1);
    }
  };

  const style1 = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "1px solid grey",
    borderRadius: "8px",
    boxShadow: 24,
    // p: 4,
  };
  const AntTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
  ))(({ theme: any }) => ({
    textTransform: "none",
  }));

  return (
    <>
      {
        myloadar ? (
          <Loader />
        ) : roleid === 1 || roleid !== 2 ? (
          <Box sx={{ display: "flex" }}>
            <MiniDrawer />
            <Modal
              keepMounted
              open={open}
              onClose={handleClose}
              aria-labelledby="keep-mounted-modal-title"
              aria-describedby="keep-mounted-modal-description"
            >
              <Box sx={style1}>
                <Typography
                  id="keep-mounted-modal-title"
                  variant="h6"
                  component="h2"
                  className="deleteusercss"
                >
                  Delete{" "}
                  {activityName && activityName !== ""
                    ? activityName + " " + "activity"
                    : "Activity"}
                </Typography>
                <div className="linecss"></div>
                <Typography
                  id="keep-mounted-modal-description"
                  sx={{ mt: 2 }}
                  className="confirmcss"
                >
                  Are you sure want to delete from the records?
                </Typography>
                <br />
                <div className="popupcss" style={{ textAlign: "end" }}>
                  <Button color="error" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button color="success" onClick={handleActivityDelete}>
                    Ok
                  </Button>
                </div>
              </Box>
            </Modal>
            <Box component="main" sx={{ flexGrow: 1 }}>
              <div className="guardianBar">
                {/*bread cump */}
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
                          href="/admin/dashboard"
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
                          Activity
                        </Link>
                      </Breadcrumbs>
                    </Stack>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ fontWeight: "bold", color: "#333333" }}
                    >
                      ACTIVITY
                    </Typography>
                  </Stack>

                  {(custpermit && custpermit.canAdd === true) || roleid === 1 ? (
                    <Link
                      href="/admin/addactivity"
                      style={{ color: "#1A70C5", textDecoration: "none" }}
                    >
                      <Button
                        className="button-new"
                        variant="contained"
                        size="small"
                        sx={{ width: 150 }}
                        onClick={handleNewActivityFormOpen}
                      >
                        <b>Add New Activity</b>
                      </Button>
                    </Link>
                  ) : (
                    ""
                  )}
                </Stack>
                {/*bread cump */}
                {myload ? <Loader /> :
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
                        <Box>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                          >
                            <AntTab
                              className="filter-list"
                              label={`All (${All})`}
                              {...a11yProps(0)}
                              onClick={handleAll}
                            />
                            <AntTab
                              label={`Upcomming (${upcoming.length})`}
                              {...a11yProps(1)}
                              onClick={handleUpcoming}
                            />
                            <AntTab
                              label={`Past (${past.length})`}
                              {...a11yProps(2)}
                              onClick={handlePast}
                            />
                            <AntTab
                              label={`Current (${current.length})`}
                              {...a11yProps(3)}
                              onClick={handleCurrent}
                            />
                          </Tabs>
                        </Box>
                        <Stack
                          direction="row"
                          alignItems="center"
                          className="fimport-export-box"
                        >
                          <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                              <Box>
                                <MenuItem {...bindTrigger(popupState)}>
                                  <BiFilterAlt />
                                  &nbsp; Filter
                                </MenuItem>
                                <Menu {...bindMenu(popupState)}>
                                  <Container>
                                    <Grid style={{ width: "1030px" }}>
                                      <Typography variant="h5">
                                        <b>Filter</b>
                                      </Typography>
                                      <form
                                      //onSubmit={handleSubmit(onSubmit)}
                                      >
                                        <Stack style={{ marginTop: "10px" }}>
                                          <Grid container spacing={2}>
                                            <Grid item xs={12} lg={3}>
                                              <Stack spacing={1}>
                                                <InputLabel htmlFor="enddate">
                                                  Status
                                                </InputLabel>
                                                <FormControl fullWidth>
                                                  <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    size="small"
                                                    onChange={(e: any) =>
                                                      setFilterStatus(e.target.value)
                                                    }
                                                    value={filterStatus}
                                                  >
                                                    <MenuItem value="Active">
                                                      Active
                                                    </MenuItem>
                                                    <MenuItem value="Draft">
                                                      Draft
                                                    </MenuItem>
                                                    <MenuItem value="Archive">
                                                      Archive
                                                    </MenuItem>
                                                  </Select>
                                                </FormControl>
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                              <Stack spacing={1}>
                                                <InputLabel htmlFor="name">
                                                  Type
                                                </InputLabel>
                                                <FormControl fullWidth>
                                                  <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    size="small"
                                                    onChange={(e: any) =>
                                                      setFilterType(e.target.value)
                                                    }
                                                    value={filterType}
                                                  >
                                                    <MenuItem value="Free">
                                                      Free
                                                    </MenuItem>
                                                    <MenuItem value="Paid">
                                                      Paid
                                                    </MenuItem>
                                                  </Select>
                                                </FormControl>
                                              </Stack>
                                            </Grid>

                                            <Grid
                                              item
                                              xs={12}
                                              style={{ marginBottom: "10px" }}
                                              className="filtercss"
                                            >
                                              <div onClick={popupState.close}>
                                                <Button
                                                  size="small"
                                                  type="submit"
                                                  variant="contained"
                                                  color="primary"
                                                  sx={{ width: 150 }}
                                                  // onClick={popupState.close}
                                                  onClick={(e) => filterApply(e)}
                                                >
                                                  <b>Apply Filter</b>
                                                  <span
                                                    style={{
                                                      fontSize: "2px",
                                                      paddingLeft: "10px",
                                                    }}
                                                  ></span>
                                                </Button>
                                              </div>
                                              &nbsp;&nbsp;
                                              <div
                                                onClick={popupState.close}
                                                className="resetfiltercss"
                                              >
                                                <Button
                                                  size="small"
                                                  variant="contained"
                                                  color="primary"
                                                  sx={{ width: 150 }}
                                                  onClick={ResetFilterValue}
                                                >
                                                  <b>Reset Filter</b>
                                                  <span
                                                    style={{
                                                      fontSize: "2px",
                                                      paddingLeft: "10px",
                                                    }}
                                                  ></span>
                                                </Button>
                                              </div>
                                            </Grid>
                                          </Grid>
                                        </Stack>
                                      </form>
                                    </Grid>
                                  </Container>
                                </Menu>
                              </Box>
                            )}
                          </PopupState>
                          <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                              <Box>
                                <MenuItem
                                  {...bindTrigger(popupState)}
                                //onClick={ExportCSV}
                                >
                                  Export
                                  {/* <KeyboardArrowDownIcon /> */}
                                </MenuItem>
                              </Box>
                            )}
                          </PopupState>
                          <FormControl>
                            <TextField
                              placeholder="Search..."
                              size="small"
                              value={searchquery}
                              type="search"
                              onInput={(e) => handleSearch(e)}
                            />
                          </FormControl>
                        </Stack>
                      </Stack>
                      {/*bread cump */}
                      {/* {myload ? <Loader /> : */}
                      <Table style={{ marginTop: "20px" }}>
                        <TableHead>
                          <TableRow>
                            {/* <TableCell padding="checkbox">
                              <Checkbox
                              //onChange={handleCheck}
                              />
                            </TableCell> */}
                            <TableCell>
                              <Typography>ID</Typography>
                            </TableCell>
                            <TableCell className="t-name">
                              <Typography>NAME</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>TYPE</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>START DATE</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography width={100}>END DATE</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>STATUS</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography width={150}>AMOUNT(if paid)</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>ACTION</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* {DATA.currentData()} */}
                          {DATA.currentData() &&
                            DATA.currentData().map((item: any, key: any) => {
                              const {
                                id,
                                name,
                                price,
                                type,
                                startDate,
                                status,
                                endDate,
                                description,
                              } = item;
                              return (
                                <TableRow
                                  key={key}
                                  hover
                                  tabIndex={-1}
                                  role="checkbox"
                                  className="boder-bottom"
                                >
                                  {/* <TableCell padding="checkbox">
                                    <Checkbox />
                                  </TableCell> */}
                                  <TableCell align="left">{id}</TableCell>
                                  <TableCell align="left">{name}</TableCell>
                                  <TableCell align="left">
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                  </TableCell>
                                  <TableCell align="left">
                                    {" "}
                                    {moment(startDate, "YYYY.MM.DD").format("ll")}
                                  </TableCell>
                                  <TableCell align="left">
                                    {" "}
                                    {moment(endDate, "YYYY.MM.DD").format("ll")}
                                  </TableCell>
                                  <TableCell align="left">
                                    {todayDate === startDate ? (
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          color: " #15c6cf",
                                          fontWeight: "600",
                                        }}
                                      >
                                        CURRENT
                                      </p>
                                    ) : todayDate < startDate ? (
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          color: " #02c509",
                                          fontWeight: "600",
                                        }}
                                      >
                                        UPCOMING
                                      </p>
                                    ) : todayDate > startDate ? (
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          color: " rgb(241 61 61)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        PAST ACTIVITY
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                    {/* {status.toUpperCase()} */}
                                  </TableCell>
                                  <TableCell align="left">{price} {" (" + qatar_currency + ")"}</TableCell>
                                  <TableCell align="left">
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      className="action"
                                    >
                                      {(custpermit && custpermit.canView === true) ||
                                        roleid === 1 ? (
                                        <IconButton className="action-view">
                                          <Link
                                            href={`/admin/activitydetail/${id}`}
                                            title="View Activity"
                                            style={{
                                              color: "#26CEB3",
                                            }}
                                          >
                                            <BiShow />
                                          </Link>
                                        </IconButton>
                                      ) : (
                                        ""
                                      )}
                                      {(custpermit && custpermit.canEdit === true) ||
                                        roleid === 1 ? (
                                        <Link
                                          href={`/admin/editactivity/${id}`}
                                          title="Edit Activity"
                                          style={{
                                            color: "#26CEB3",
                                          }}
                                        >
                                          <IconButton className="action-edit">
                                            <FiEdit />
                                          </IconButton>
                                        </Link>
                                      ) : (
                                        ""
                                      )}

                                      {(custpermit &&
                                        custpermit.canDelete === true) ||
                                        roleid === 1 ? (
                                        <IconButton
                                          className="action-delete"
                                          title="Delete Activity"
                                          style={{ color: "#F95A37" }}
                                          onClick={() => openDelete(item)}
                                        >
                                          <RiDeleteBin5Fill />
                                        </IconButton>
                                      ) : (
                                        ""
                                      )}
                                      <Button
                                        size="small"
                                        className="action-delete copycss"
                                        title="Copy Activity URL"
                                        style={{ color: "#F95A37" }}
                                        onClick={() => copyCode(item)}
                                      >
                                        <RiFileCopyLine />
                                      </Button>
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                      {/* } */}
                      {activites == "" ? <h3>No Record found</h3> : ""}
                      <Stack
                       style={{ marginBottom: "10px", marginTop: "10px" }}
                       direction="row"
                       alignItems="right"
                       justifyContent="space-between"
                      >
                        <Pagination
                          className="pagination"
                          count={count}
                          page={page}
                          color="primary"
                          onChange={handlePageChange}
                        />
                        <FormControl>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={5}
                            onChange={handlerowchange}
                            size="small"
                            style={{ width: "50px", height: "40px" }}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </TableContainer>
                  </Card>
                }
              </div>
              <MainFooter />
            </Box>
          </Box>) : ""}
      <ToastContainer />
    </>
  );
}
