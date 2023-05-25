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
  styled,
} from "@mui/material";
import moment from "moment";
import Box from "@mui/material/Box";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MiniDrawer from "../../sidebar";
import { api_url, auth_token } from "../../../helper/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/router";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import MainFooter from "../../commoncmp/mainfooter";
import Alert from "@mui/material/Alert";
import Loader from "../../commoncmp/myload";
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

export default function CreditRequestList() {
  const [activityLogs, setActivityLogs] = useState<any>([]);
  const [fullCreditRequest, setFullCreditRequest] = useState<any>([]);
  const [searchquery, setsearchquery] = useState("");
  const [searchdata, setsearchdata] = useState([]);
  const [All, setAll] = useState(0);
  const [value, setValue] = React.useState(0);
  const [custpermit, setcustpermit] = useState<any>([]);
  const [roleid, setroleid] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [myloadar, setmyloadar] = React.useState(true);
  setTimeout(() => {
    setmyloadar(false);
  }, 500);

  // verify user login
  let logintoken: any;
  const router = useRouter();
  React.useEffect(() => {
    if (!process.env.NEXT_PUBLIC_AMEX_SALES_ORDER_REDIRECT_URL) {
      logintoken = localStorage.getItem("QIS_loginToken");
      if (logintoken === undefined || logintoken === null) {
        router.push("/");
      }
    }
    commmonfunctions.GivenPermition().then((res) => {
      if (res.roleId == 1) {
        setroleid(res.roleId);
        //router.push("/userprofile");
      }
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  //get creditRequest
  const url = `${api_url}/getlogsactivity`;
  const fetchData = async () => {
    await axios({
      method: "POST",
      url: url,
      headers: {
        Authorization: auth_token,
      },
    }).then((res: any) => {
      setActivityLogs(res.data.data);
      setsearchdata(res.data.data);
    }).catch((error: any) => {
      console.log("error", error);
    })
  };
  //searching
  const handleSearch = (e: any) => {
    setsearchquery(e.target.value);
    if (e.target.value === "") {
      fetchData();
    } else {
      const filterres = activityLogs.filter((item: any) => {
        return (
          item?.userEmail?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.userName
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      const dtd = filterres;
      setActivityLogs(dtd);
    }
  };

  const pendingOrder = fullCreditRequest?.filter(
    (a: any) => a?.is_complete === 0
  );
  const completeOrder = fullCreditRequest?.filter(
    (a: any) => a?.is_complete === 1
  );
  const allListData = fullCreditRequest?.filter((a: any) => a);

  //pagination
  const [row_per_page, set_row_per_page] = useState(5);
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  let [page, setPage] = useState(1);
  const PER_PAGE = row_per_page;
  const count = Math.ceil(activityLogs.length / PER_PAGE);
  const DATA = usePagination(activityLogs, PER_PAGE);

  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };
  const AntTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
  ))(({ theme }) => ({
    textTransform: "none",
  }));

  return (
    <>
      {
        myloadar ? (
          <Loader />
        ) : roleid === 1 ? (< Box sx={{ display: "flex" }}>
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
                        Activity Logs
                      </Link>
                    </Breadcrumbs>
                  </Stack>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ fontWeight: "bold", color: "#333333" }}
                  >
                    LOGS
                  </Typography>
                  {showSuccess && (
                    <Alert
                      style={{
                        width: "50%",
                        height: 50,
                        marginLeft: 430,
                        marginTop: "-50px",
                      }}
                      severity="success"
                    >
                      Thank You ! Payment Recieved
                    </Alert>
                  )}
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
                        // value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                      >
                      </Tabs>
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
                          type="search..."
                          onInput={(e) => handleSearch(e)}
                        />
                      </FormControl>
                    </Stack>
                  </Stack>
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
                        <TableCell className="t-name" >
                          <Typography>USER INFO</Typography>
                        </TableCell>
                        <TableCell className="t-name">
                          <Typography></Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>MESSAGE</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>DATE</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {DATA.currentData() &&
                        DATA.currentData().map((item: any, key: any) => {
                          const {
                            id,
                            userName,
                            userEmail,
                            message,
                            createdAt,
                          } = item;
                          return (
                            <TableRow
                              key={key}
                              hover
                              tabIndex={-1}
                              role="checkbox"
                            // className={
                            //   item?.is_complete === 0 ? "darkBgCss" : ""
                            // }
                            >
                              {/* <TableCell padding="checkbox">
                                <Checkbox />
                              </TableCell> */}
                              <TableCell align="left">
                                {id}
                              </TableCell>
                              <TableCell align="left">{userName} &nbsp; ({userEmail})</TableCell>
                              <TableCell align="left"></TableCell>
                              <TableCell align="left">{message}</TableCell>
                              <TableCell align="left">
                                {moment(createdAt, "YYYY-MM-DD").format(
                                  "MMM DD, YYYY"
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                  {/* } */}
                  {activityLogs == "" ? <h3>No Record found</h3> : ""}
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
        </Box >) : ""
      }
      <ToastContainer />
    </>
  );
}
