import {
  Card,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  FormControl,
  TextField,
  MenuItem,
  Select,
  IconButton,
  Pagination,
  Tabs,
  Tab,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MiniDrawer from "../../../sidebar";
import { api_url, auth_token } from "../../../../helper/config";
import { BiShow } from "react-icons/bi";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ConfirmBox from "../../../commoncmp/confirmbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
import MainFooter from "../../../commoncmp/mainfooter";
import { AddLogs } from "../../../../helper/activityLogs";
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

export default function UsersList() {
  const [users, setUsers] = useState<any>([]);
  const [All, setAll] = useState(0);
  const [searchquery, setsearchquery] = useState("");
  const [searchdata, setsearchdata] = useState([]);
  const [deleteConfirmBoxOpen, setdeleteConfirmBoxOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [myload, setmyload] = useState(true);
  const [roleid, setroleid] = useState(0);
  const [custpermit, setcustpermit] = useState<any>([]);
  setTimeout(() => {
    setmyload(false);
  }, 1500);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  let logintoken: any;
  const router = useRouter();
  useEffect(() => {
    // verify user login and previlegs
    logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      setroleid(res.roleId);
      if (res.roleId == 1) {
        setroleid(res.roleId);
      } else if (res.roleId > 1 && res.roleId !== 2) {
        commmonfunctions.ManageUserManagement().then((res) => {
          if (!res) {
            router.push("/userprofile");
          } else {
            setcustpermit(res);
          }
        });
      } else {
        router.push("/userprofile");
      }
    });
    getUser();
  }, []);

  //get customers(users) list
  const getUser = async () => {
    const url = `${api_url}/getuser`;
    const reqData: any = { isUser: 1 }
    try {

      await axios({
        method: "POST",
        url: url,
        data: reqData,
        headers: {
          Authorization: auth_token,
          "x-access-token": logintoken,
        },
      }).then((res: any) => {
        setUsers(
          res.data.data.users
        );
        setsearchdata(
          res.data.data.users
        );
        setAll(
          res.data.data.users.length
        );
      }).catch((err) => {
        console.log(err)
      })

    } catch (error) {
      console.log("error", error);
    }
  };
  // apply searching
  const handleSearch = (e: any) => {
    setsearchquery(e.target.value);
    setPage(1);
    DATA.jump(1);
    console.log(typeof e.target.value);
    if (e.target.value === "") {
      setUsers(searchdata);
    } else {
      const filterres = searchdata.filter((item: any) => {
        return (
          item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.email1.toLowerCase().includes(e.target.value.toLowerCase()) ||
          `${item.phone1}`.includes(e.target.value)
        );
      });
      const dtd = filterres;
      setUsers(dtd);
    }
  };

  // pagination;
  const [row_per_page, set_row_per_page] = useState(5);
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  let [page, setPage] = React.useState(1);
  const PER_PAGE = row_per_page;
  const count = Math.ceil(users.length / PER_PAGE);
  const DATA = usePagination(users, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  //delete user
  const [deleteData, setDeleteData] = useState<any>({});
  function openDelete(data: any) {
    setdeleteConfirmBoxOpen(true);
    setDeleteData(data);
  }
  async function deleteUser() {
    let reqData = { isDeleted: 1 };
    await axios({
      method: "DELETE",
      url: `${api_url}/deleteuser/${deleteData.id}`,
      data: reqData,
      headers: {
        Authorization: auth_token,
        "x-access-token": logintoken,
      },
    })
      .then((data) => {
        toast.success("User Deleted Successfully !");
        setdeleteConfirmBoxOpen(false);
        getUser();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  //tab functionality
  function handleAll() {
    getUser();
  }
  return (
    <>
      {
        myload ? (
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
                          href="/admin/usermanagement/users"
                          style={{ color: "#7D86A5", textDecoration: "none" }}
                        >
                          User
                        </Link>
                      </Breadcrumbs>
                    </Stack>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ fontWeight: "bold", color: "#333333" }}
                    >
                      USER MANAGEMENT
                    </Typography>
                  </Stack>

                  {(custpermit && custpermit.canAdd === true && roleid > 1) || roleid === 1 ? (
                    <Button
                      className="button-new"
                      variant="contained"
                      size="small"
                      sx={{ width: 150 }}
                      onClick={() => router.push("/admin/usermanagement/addnewuser")}
                    >
                      <b>New User</b>
                    </Button>
                  ) : (
                    ""
                  )}
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
                          TabIndicatorProps={{
                            style: {
                              backgroundColor: "#F95A37",
                            },
                          }}
                        >
                          <Tab
                            className="filter-list"
                            label={`All (${All})`}
                            {...a11yProps(0)}
                            onClick={handleAll}
                            style={{ color: "#F95A37" }}
                          />
                        </Tabs>
                      </Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        className="fimport-export-box"
                      >
                        <FormControl>
                          <TextField
                            placeholder="Search name, email or number"
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
                          {/* <TableCell padding="checkbox">
                            <Checkbox />
                          </TableCell> */}
                          <TableCell>
                            <Typography>ID</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>USER NAME</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>EMAIL</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>PHONE NO</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>ROLE</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>ACTION</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {DATA.currentData() &&
                          DATA.currentData().map((dataitem: any, key: any) => {
                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                role="checkbox"
                                key={key}
                                className="boder-bottom"
                              >
                                {/* <TableCell padding="checkbox">
                                  <Checkbox
                                    //onChange={handleChanges} value={dataitem.id}
                                    //checked={checked}
                                    id={`check` + key}
                                  />
                                </TableCell> */}
                                <TableCell align="left">{dataitem.id}</TableCell>
                                <TableCell align="left">{dataitem.name}</TableCell>
                                <TableCell align="left">
                                  <a href="">{dataitem.email1}</a>
                                </TableCell>
                                <TableCell align="left">
                                  {dataitem.phone1}
                                </TableCell>
                                <TableCell align="left">
                                  {dataitem.UserRole}
                                </TableCell>
                                <TableCell align="left">
                                  <Stack
                                    className="action"
                                    direction="row"
                                    spacing={1}
                                  >
                                    {(custpermit && custpermit.canView === true && roleid > 1 || roleid === 1) ? (
                                      <IconButton className="action-view">
                                        <Link
                                          href={`/admin/usermanagement/viewuser/${dataitem.id}`}
                                          title="View User"
                                          style={{
                                            color: "#26CEB3",
                                          }}
                                        >
                                          <BiShow />
                                        </Link>
                                      </IconButton>
                                    ) : ''}
                                    {(custpermit && custpermit.canEdit === true && roleid > 1 || roleid === 1) ? (
                                      <IconButton className="action-edit">
                                        <Link
                                          href={`/admin/usermanagement/edituser/${dataitem.id}`}
                                          title="Edit User"
                                          style={{
                                            color: "#26CEB3",
                                          }}
                                        >
                                          {" "}
                                          <FiEdit />
                                        </Link>
                                      </IconButton>
                                    ) : ''}
                                    {(custpermit && custpermit.canDelete === true && roleid > 1 || roleid === 1) ? (
                                      <IconButton
                                        className="action-delete"
                                        title="Delete User"
                                        style={{ color: "#F95A37" }}
                                        onClick={() => openDelete(dataitem)}
                                      >
                                        <RiDeleteBin5Fill />
                                      </IconButton>
                                    ) : ''}
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                    {users == "" ? <h3>No Record found</h3> : ""}
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
              </div>
              <MainFooter />
            </Box>
          </Box>) : ""}
      <ConfirmBox
        open={deleteConfirmBoxOpen}
        closeDialog={() => setdeleteConfirmBoxOpen(false)}
        title={deleteData?.name}
        deleteFunction={deleteUser}
      />
      <ToastContainer />
    </>
  );
}
