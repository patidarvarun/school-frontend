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
  Autocomplete,
} from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiFilterAlt, BiShow } from "react-icons/bi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { api_url, auth_token, qatar_currency } from "../../../../helper/config";
import MiniDrawer from "../../../sidebar";
import DeleteFormDialog from "./deletedialougebox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";
import MainFooter from "../../../commoncmp/mainfooter";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
import { useRouter } from "next/router";
import Loader from "../../../commoncmp/myload";
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
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
  status: number;
  sorting: number;
  startdate: Date;
  enddate: Date;
  customerId: number;
};

export default function CreditNotesList() {
  const [creditnotes, setcreditnotes] = useState<any>([]);
  const [creditNotes, setFullcreditNotes] = useState<any>([]);
  const [searchquery, setsearchquery] = useState("");
  const [searchdata, setsearchdata] = useState([]);
  const [All, setAll] = useState(0);
  const [value, setValue] = React.useState(0);
  const [custpermit, setcustpermit] = useState<any>([]);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [users, setUsers] = useState<any>([]);
  const [id, setid] = React.useState(0);
  const [status, setstatus] = useState<any>(4);
  const [val, setVal] = useState<any>({});
  const [sort, setsort] = useState<any>(0);
  const [startdate, setstartdate] = useState<FormValues | any>(null);
  const [enddate, setenddate] = useState<any>("");
  const [inputValue, setInputValue] = React.useState("");
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [roleid, setroleid] = useState(0);
  const router = useRouter();
  const [myloadar, setmyloadar] = React.useState(true);
  setTimeout(() => {
    setmyloadar(false);
  }, 700);

  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
      }
    });
    const logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      setroleid(res.roleId);
      if (res.roleId === 1) {
      } else if (res.roleId > 1 && res.roleId !== 2) {
        commmonfunctions.ManageCreditNotes().then((res) => {
          if (!res) {
            router.push("/userprofile");
          }
        });
      } else {
        setcustpermit(res);
      }
    });
    fetchData();
    getUser();
  }, []);

  //get credit notes
  const url = `${api_url}/getSageCreditNotes`;
  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        method: "post",
        headers: {
          Authorization: auth_token,
        },
      });
      const json = await response.json();
      setcreditnotes(json.data);
      setsearchdata(json.data);
      setFullcreditNotes(json.data);
      setAll(json.data.length);
    } catch (error: any) {
      console.log("error", error);
    }
  };

  //get customers(users) list
  const getUser = async () => {
    const url = `${api_url}/getuser`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      setUsers(res.data.filter((dt: any) => dt.roleId !== 1));
    } catch (error) {
      console.log("error", error);
    }
  };
  const option: { id: number; title: string }[] = [];
  users &&
    users.map((data: any, key: any) => {
      return option.push({
        id: data.id,
        title: data.name,
      });
    });

  //searching
  const handleSearch = (e: any) => {
    setsearchquery(e.target.value);
    if (e.target.value === "") {
      setcreditnotes(searchdata);
    } else {
      const filterres = searchdata.filter((item: any) => {
        console.log(item);
        return (
          item?.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          `${item?.amount}`.includes(e.target.value) ||
          item?.email1?.toLowerCase().includes(e.target.value.toLowerCase())
        );
      });
      const dtd = filterres;
      setcreditnotes(dtd);
    }
  };

  //reset filter value
  function ResetFilterValue() {
    setstatus(4);
    setVal([]);
    setsort(0);
    setstartdate(null);
    setenddate(null);
    fetchData();
  }

  //filter data
  const filterApply = async (e: any) => {
    setFullcreditNotes([]);
    e.preventDefault();
    const reqData = {
      status: status,
      sorting: sort,
      customerId: val?.id !== "undefined" ? val?.id : 0,
      startdate:
        startdate !== null ? moment(startdate).format("DD/MM/YYYY") : startdate,
      enddate:
        enddate !== null ? moment(enddate).format("DD/MM/YYYY") : enddate,
    };
    await axios({
      method: "POST",
      url: `${api_url}/getCreditNotes`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res: any) => {
        if (res.status === 200) {
          setcreditnotes(res?.data?.data);
          setFullcreditNotes(res?.data?.data);
          setsearchdata(res?.data?.data);
          setAll(res?.data?.data.length);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  //pagination
  const [row_per_page, set_row_per_page] = useState(5);
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  let [page, setPage] = useState(1);
  const PER_PAGE = row_per_page;
  const count = Math.ceil(creditnotes.length / PER_PAGE);
  const DATA = usePagination(creditnotes, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  const approved = creditNotes?.filter((a: any) => a?.status === 1);
  const pending = creditNotes?.filter((a: any) => a?.status === 0);
  const reject = creditNotes?.filter((a: any) => a?.status === 2);
  const deleted = creditNotes?.filter((a: any) => a?.status === 3);
  const apprbyadmin = creditNotes?.filter((a: any) => a?.status === 4);

  const handleApproved = () => {
    setcreditnotes(approved);
  };
  const handleAll = () => {
    setsearchquery('')
    fetchData();
  };

  const handlePending = () => {
    setcreditnotes(pending);
  };
  const handleCurrent = () => {
    setcreditnotes(reject);
  };

  const handleDelete = () => {
    setcreditnotes(deleted);
  };

  const handleApprByAdmin = () => {
    setcreditnotes(apprbyadmin);
  };

  //open close delete popup boxes
  const closePoP = (data: any) => {
    setDeleteOpen(false);
    fetchData();
  };
  function openDelete(item: any) {
    setid(item.id);
    setDeleteOpen(true);
  }

  return (
    <>
      {myloadar ? (
        <Loader />
      ) : roleid === 1 || roleid !== 2 ? (
        <Box sx={{ display: "flex" }}>
          <MiniDrawer />

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
                        Credit Notes
                      </Link>
                    </Breadcrumbs>
                  </Stack>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ fontWeight: "bold", color: "#333333" }}
                  >
                    CREDIT NOTES
                  </Typography>
                </Stack>
              </Stack>
              {/*bread cump */}
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
                        <Tab
                          className="filter-list"
                          label={`All (${All})`}
                          {...a11yProps(0)}
                          onClick={handleAll}
                        />
                        {/* <Tab
                          label={`Approved (${approved.length})`}
                          {...a11yProps(1)}
                          onClick={handleApproved}
                        />
                        <Tab
                          label={`Pending (${pending.length})`}
                          {...a11yProps(2)}
                          onClick={handlePending}
                        />
                        <Tab
                          label={`Reject (${reject.length})`}
                          {...a11yProps(3)}
                          onClick={handleCurrent}
                        />
                        <Tab
                          label={`Deleted (${deleted.length})`}
                          {...a11yProps(4)}
                          onClick={handleDelete}
                        />
                        <Tab
                          label={`Approved By Admin (${apprbyadmin.length})`}
                          {...a11yProps(5)}
                          onClick={handleApprByAdmin}
                        /> */}
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
                                        {/* <Grid item xs={12} lg={4}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="enddate">
                                              Status
                                            </InputLabel>
                                            <FormControl fullWidth>
                                              <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                onChange={(e: any) =>
                                                  setstatus(e.target.value)
                                                }
                                                value={status}
                                              >
                                                <MenuItem value="4">
                                                  All
                                                </MenuItem>
                                                <MenuItem value="1">
                                                  Approved
                                                </MenuItem>
                                                <MenuItem value="0">
                                                  Pending
                                                </MenuItem>
                                                <MenuItem value="2">
                                                  Reject
                                                </MenuItem>
                                                <MenuItem value="3">
                                                  Deleted
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </Stack>
                                        </Grid> */}
                                        <Grid item xs={12} lg={4}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="enddate">
                                              Customer
                                            </InputLabel>
                                            <Autocomplete
                                              value={val}
                                              inputValue={inputValue}
                                              onChange={(event, newValue) => {
                                                setVal(newValue);
                                              }}
                                              onInputChange={(
                                                event,
                                                newInputValue
                                              ) => {
                                                setInputValue(newInputValue);
                                              }}
                                              options={option}
                                              getOptionLabel={(option) =>
                                                option.title || ""
                                              }
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  variant="outlined"
                                                  placeholder="Find or customer"
                                                />
                                              )}
                                            />
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="enddate">
                                              Sort
                                            </InputLabel>
                                            <FormControl fullWidth>
                                              <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={sort}
                                                onChange={(e: any) =>
                                                  setsort(e.target.value)
                                                }
                                              >
                                                <MenuItem value={0}>
                                                  Date, Newest First
                                                </MenuItem>
                                                <MenuItem value={1}>
                                                  Date, Oldest First
                                                </MenuItem>

                                                <MenuItem value={2}>
                                                  Name, Ascending Order
                                                </MenuItem>
                                                <MenuItem value={3}>
                                                  Name, Descending Order
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="enddate">
                                              Date Range (start date)
                                            </InputLabel>
                                            <DatePicker
                                              className="myDatePicker"
                                              id="startdate"
                                              selected={startdate}
                                              dateFormat="MM/dd/yyyy"
                                              placeholderText="Start Date"
                                              onChange={(date: any) =>
                                                setstartdate(date)
                                              }
                                            />
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="enddate">
                                              End Date
                                            </InputLabel>
                                            <DatePicker
                                              className="myDatePicker"
                                              id="enddate"
                                              selected={enddate}
                                              dateFormat="MM/dd/yyyy"
                                              placeholderText="Start Date"
                                              onChange={(date: any) =>
                                                setenddate(date)
                                              }
                                            />
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
                        </TableCell>*/}
                        <TableCell>
                          <Typography width={100}>ID</Typography>
                        </TableCell>
                        <TableCell width={200}>
                          <Typography>CUSTOMER NAME</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>EMAIL</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={150}>REQ DATE</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={150}>IS RELATED</Typography>
                        </TableCell>
                        {/* <TableCell>
                          <Typography width={150}>STATUS</Typography>
                        </TableCell> */}
                        <TableCell>
                          <Typography width={150}>
                            AMOUNT {"(" + qatar_currency + ")"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={150}>INVOICE ID</Typography>
                        </TableCell>
                        {/* <TableCell>
                          <Typography>ACTION</Typography>
                        </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {DATA.currentData() &&
                        DATA.currentData().map((item: any, key: any) => {
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
                              <TableCell align="left">CRD-{item.id}</TableCell>
                              <TableCell align="left">
                                {item.customerName}
                              </TableCell>
                              <TableCell align="left">{item.email1}</TableCell>
                              <TableCell align="left">
                                {" "}
                                {moment(item.createdAt).format(
                                  "ll"
                                )}
                                {/* {moment(item?.createdAt,"DD/MM/YYYY").format("MM DD,YYYY")} */}
                              </TableCell>
                              <TableCell align="left">
                                <Typography>
                                  {item?.sageInvoiceId !== "" ? (
                                    <span
                                      style={{
                                        color: "#3366ff",
                                        fontSize: "14px",
                                      }}
                                    >
                                      Tuition Invoice Related
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        color: "#02C509",
                                        fontSize: "14px",
                                      }}
                                    >
                                      Activity Related
                                    </span>
                                  )}
                                </Typography>
                              </TableCell>
                              {/* <TableCell align="left">
                                {item?.status === 0 ? (
                                  <span
                                    style={{
                                      color: "#FF4026",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Pending
                                  </span>
                                ) : item?.status === 1 ? (
                                  <span
                                    style={{
                                      color: "#02C509",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Approved
                                  </span>
                                ) : item?.status === 2 ? (
                                  <span
                                    style={{
                                      color: "#FF4026",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Reject
                                  </span>
                                ) : item?.status === 3 ? (
                                  <span
                                    style={{
                                      color: "#FF4026",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Deleted
                                  </span>
                                ) : item?.status === 4 && item?.is_complete !== 1 ? (
                                  <span
                                    style={{
                                      color: "#FF4026",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Appr By Admin
                                  </span>
                                )  :
                                item?.status === 4 && item?.is_complete === 1 ? (
                                  <span
                                    style={{
                                      color: "#02C509",
                                      fontWeight: "bold",
                                      marginLeft:"5px"
                                    }}
                                  >
                                    Appr By Admin
                                  </span>
                                )  :(
                                  ""
                                )}
                              </TableCell> */}
                              <TableCell align="left">
                                {item.amount} {"(" + qatar_currency + ")"}
                              </TableCell>
                              <TableCell align="left">
                                {item.sageInvoiceId}
                              </TableCell>
                              {/* <TableCell align="left">
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  className="action"
                                > 
                                  {/* {(custpermit &&
                                    custpermit.canView === true) ||
                                  roleid === 1 ? ( */}
                                    {/* <IconButton className="action-view">
                                      <Link
                                        href={`/admin/creditnotes/viewcreditnotes/${item.id}`}
                                        title="View Credit"
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
                                 {item.status === 3 ? (
                                    ""
                                  ) :
                                   (custpermit && 
                                   //     custpermit.canDelete === true) ||
                                  //   roleid === 1 ? (
                                    <IconButton
                                      className="action-delete"
                                      title="Delete Credit"
                                      style={{ color: "#F95A37" }}
                                      onClick={() => openDelete(item)}
                                    >
                                      <RiDeleteBin5Fill />
                                    </IconButton>
                                  // ) : (
                                  //   ""
                                  )}
                                </Stack>
                              </TableCell> */}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                  {/* } */}
                  {creditnotes == "" ? <h3>No Record found</h3> : ""}
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
            </div>
            <MainFooter />
          </Box>
        </Box>
      ) : (
        ""
      )}
      <DeleteFormDialog id={id} open={deleteOpen} closeDialog={closePoP} />
      <ToastContainer />
    </>
  );
}
