import {
    Card,
    Table,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    FormControl,
    TableContainer,
    TableHead,
    Button,
    Breadcrumbs,
    Box,
    Pagination,
    OutlinedInput,
    Typography,
    Tabs,
    Tab,
  } from "@mui/material";
  import { Stack } from "@mui/material";
  import Link from "next/link";
  import React, { useEffect, useState } from "react";
  import MiniDrawer from "../../sidebar";
  import axios from "axios";
  import Select from "@mui/material/Select";
  import moment from "moment";
  import Image from "next/image";
  import "react-datepicker/dist/react-datepicker.css";
  import MenuItem from "@mui/material/MenuItem";
  import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { useRouter } from "next/router";
  import commmonfunctions from "../../../commonFunctions/commmonfunctions";
  import { api_url, auth_token, qatar_currency } from "../../../helper/config";
  import MainFooter from "../../commoncmp/mainfooter";
  import Loader from "../../commoncmp/myload";
  import UserService from "../../../commonFunctions/servives";
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  
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
  
  export default function UserInvoices() {
    const [getCreditReq, setgetCreditReq] = useState<any>([]);
    const [CreditReq, setCreditReq] = useState<any>([]);
    const [custid, setcustid] = useState<any>([]);
    const [searchdata, setsearchdata] = useState([]);
    const [searchquery, setsearchquery] = useState("");
    const [allReqData, setAllReqData] = useState([]);
    const [value, setValue] = useState(0);
    const handleChanges = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
    const router = useRouter();
    const [roleid, setroleid] = React.useState<any>("");
    const [myload, setmyload] = React.useState(true);
    setTimeout(() => {
      setmyload(false);
    }, 700);
  
    let logintoken: any;
    // verify user login and previlegs
    useEffect(() => {
      commmonfunctions.VerifyLoginUser().then((res) => {
        if (res.exp * 1000 < Date.now()) {
          localStorage.removeItem("QIS_loginToken");
          localStorage.removeItem("QIS_User");
          router.push("/");
        }
        const idds = res?.id;
        getChilds(res?.id, idds);
        if (res && res?.id) {
          setcustid(res?.id);
          GetCreditReqByUser(res.id);
        }
      });
      logintoken = localStorage.getItem("QIS_loginToken");
      if (logintoken === undefined || logintoken === null) {
        router.push("/");
      }
      commmonfunctions.GivenPermition().then((res) => {
        if (res.roleId === 2) {
        } else {
          router.push("/userprofile");
        }
      });
    }, []);
  
    //get credit req by user id
    const GetCreditReqByUser = async (id: any) => {
      await axios({
        method: "get",
        url: `${api_url}/getCreditReqByuser/${id}`,
        headers: {
          Authorization: auth_token,
        },
      })
        .then((res) => {
          setAllReqData(res?.data?.data);
          setgetCreditReq(res?.data?.data);
          setCreditReq(res?.data?.data);
          setsearchdata(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getChilds = async (id: any, cuUId: any) => {
      UserService.getChilds(id).then((response: any[]) => {
        //get child ids
        let ids: any[] = [];
        response.map((dt: any) => {
          ids.push(dt.id)
        })
        const invids = ids.concat(cuUId);
        setcustid(invids);
        GetCreditReqByUser(invids);
      })
    }
    // pagination;
    const [row_per_page, set_row_per_page] = useState(5);
    function handlerowchange(e: any) {
      set_row_per_page(e.target.value);
    }
    let [page, setPage] = React.useState(1);
    const PER_PAGE = row_per_page;
    const count = Math.ceil(getCreditReq?.length / PER_PAGE);
    const DATA = usePagination(getCreditReq, PER_PAGE);
    const handlePageChange = (e: any, p: any) => {
      setPage(p);
      DATA.jump(p);
    };
  
    //tab functionality
    const approved = CreditReq?.filter((a: any) => a.status === 4);
    const pendings = CreditReq?.filter((a: any) => a.status === 0);
    const reject = CreditReq?.filter((a: any) => a.status == 2);
  
    const handleAll = () => {
      setsearchquery('');
      GetCreditReqByUser(custid);
    };
    const handleApproved = () => {
      setgetCreditReq(approved);
    };
    const handlePending = () => {
      setgetCreditReq(pendings);
    };
    const handleReject = () => {
      setgetCreditReq(reject);
    };
  
    // searching functionality
    const searchItems = (e: any) => {
      setsearchquery(e.target.value);
      if (e.target.value === "") {
        setgetCreditReq(searchdata);
      } else {
        const filterres = getCreditReq.filter((item: any) => {
          return (
            item.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            `${item?.amount}`.includes(e.target.value)
          );
        });
        const dtd = filterres;
        setgetCreditReq(dtd);
      }
    };
  
    return (
      <>
        {
          myload ? (
            <Loader />
          ) : (
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
                            Credit Invoice
                          </Link>
                        </Breadcrumbs>
                      </Stack>
                      <Typography
                        variant="h5"
                        gutterBottom
                        style={{ fontWeight: "bold", color: "#333333" }}
                      >
                        CREDIT INVOICE
                      </Typography>
                    </Stack>
                  </Stack>
                  <Card
                    style={{ margin: "10px", padding: "15px" }}
                    className="box-shadow"
                  >
                    <TableContainer>
                      <Stack
                        style={{ marginBottom: "10px" }}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Tabs
                            value={value}
                            onChange={handleChanges}
                            aria-label="basic tabs example"
                          >
                            <Tab
                              className="filter-list"
                              label={`All (${allReqData.length})`}
                              {...a11yProps(0)}
                              onClick={handleAll}
                            />
                            <Tab
                              label={`Approved  (${approved.length})`}
                              {...a11yProps(1)}
                              onClick={handleApproved}
                            />
                            <Tab
                              label={`Pending   (${pendings.length})`}
                              {...a11yProps(2)}
                              onClick={handlePending}
                            />
                            <Tab
                              label={`Rejected(${reject.length})`}
                              {...a11yProps(3)}
                              onClick={handleReject}
                            />
                          </Tabs>
                        </Box>
                        <Stack
                          direction="row"
                          alignItems="center"
                          className="fimport-export-box"
                        >
                          <FormControl>
                            <OutlinedInput
                              onChange={(e) => searchItems(e)}
                              id="name"
                              type="text"
                              name="name"
                              placeholder="Search"
                              value={searchquery}
                            />
                          </FormControl>
                        </Stack>
                      </Stack>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {/* <TableCell padding="checkbox">
                              <Checkbox />
                            </TableCell> */}
                            <TableCell>ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>REQ DATE</TableCell>
                            <TableCell>Is RELATED</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell>AMOUNT {" (" + qatar_currency + ")"}</TableCell>
                            <TableCell>INVOICE ID</TableCell>
                            <TableCell className="action-th">ACTION</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {DATA.currentData() && DATA.currentData() ? (
                            DATA.currentData().map((item: any) => (
                              <TableRow
                                hover
                                tabIndex={-1}
                                role="checkbox"
                                className="boder-bottom"
                              >
                                {/* <TableCell padding="checkbox">
                                  <Checkbox />
                                </TableCell> */}
                                <TableCell component="th" scope="row" padding="none">
                                  <TableCell align="left">CRD-{item.id}</TableCell>
                                </TableCell>
                                <TableCell align="left">
                                  {item.name}
                                </TableCell>
                                <TableCell align="left">
                                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                                </TableCell>
                                <TableCell align="left">
                                  <Typography>
                                    {item?.sageInvoiceId !== "" ? (
                                      <span
                                        style={{ color: "#3366ff", fontSize: "14px" }}
                                      >
                                        Tuition Invoice Related
                                      </span>
                                    ) : (
                                      <span
                                        style={{ color: "#02C509", fontSize: "14px" }}
                                      >
                                        Activity Related
                                      </span>
                                    )}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  {item?.status === 0 ? (
                                    <span style={{ color: "#FF4026" }}>Pending</span>
                                  ) : item?.status === 4 ? (
                                    <span style={{ color: "#02C509" }}>Approved</span>
                                  ) : item?.status === 2 ? (
                                    <span style={{ color: "#FF4026" }}>Reject</span>
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                                <TableCell align="left">{item.amount}.00 {" (" + qatar_currency + ")"}</TableCell>
                                <TableCell align="left">{item.sageInvoiceId}</TableCell>
                                <TableCell align="left" className="action-td">
                                  <div className="btn">
                                    <Button className="idiv">
                                      <Link
                                        href={`/user/creditinvoices/creditinvoiceview/${item.id}`}
                                      >
                                        <Image
                                          src="/view.png"
                                          alt="Picture of the author"
                                          width={35}
                                          height={35}
                                        />
                                      </Link>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <h3>No Record found</h3>
                          )}
                        </TableBody>
                      </Table>
                      {getCreditReq == "" ? <h3>No Record found</h3> : ""}
                      <Stack
                         style={{ marginBottom: "10px", marginTop: "10px" }}
                         direction="row"
                         alignItems="right"
                         justifyContent="space-between"
                        >
                        <Pagination
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
                  <ToastContainer />
                </div>
                <MainFooter />
              </Box>
            </Box>)}
      </>
    );
  }
  