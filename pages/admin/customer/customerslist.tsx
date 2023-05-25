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
  Menu,
  MenuItem,
  Grid,
  InputLabel,
  Container,
  Select,
  IconButton,
  OutlinedInput,
  Pagination,
  Tabs,
  Tab,
  Modal,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MiniDrawer from "../../sidebar";
import { api_url, auth_token } from "../../../helper/config";
import { BiFilterAlt, BiShow } from "react-icons/bi";
import CachedIcon from '@mui/icons-material/Cached';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ConfirmBox from "../../commoncmp/confirmbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCustomer from "./addNewCustomer";
import EditCustomer from "./editcustomer";
import { useRouter } from "next/router";
import { CSVDownload } from "react-csv";
import Loader from "../../commoncmp/myload";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import MainFooter from "../../commoncmp/mainfooter";
import { AddLogs } from "../../../helper/activityLogs";
import Image from "next/image";
import { BsTelegram } from "react-icons/bs";
import UserService from "../../../commonFunctions/servives";
import { qatar_currency } from "../../../helper/config";
import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "rgb(26, 112, 197)",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgb(26, 112, 197)",
  },
}));

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
  customerType: number;
  status: number;
  phoneNumber: number;
  contactName: string;
  sorting: number;
  ParentId: string;
  childId: number;
};
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CustomerList() {
  const [users, setUsers] = useState<any>([]);
  const [UserId, setUserId] = useState(0);
  const [custtype, setcusttype] = useState<any>([]);
  const [tabFilterData, settabFilterData] = useState<any>([]);
  const [All, setAll] = useState(0);
  const [active, setactive] = useState(0);
  const [inActive, setinActive] = useState(0);
  const [searchquery, setsearchquery] = useState("");
  const [searchdata, setsearchdata] = useState([]);
  const [deleteConfirmBoxOpen, setdeleteConfirmBoxOpen] = React.useState(false);
  const [newCustOpen, setnewCustOpen] = React.useState(false);
  const [editCustOpen, seteditCustOpen] = React.useState(false);
  const [editid, seteditid] = useState<any>(0);
  const [value, setValue] = React.useState(0);
  const [custType, setCustType] = useState<any>(0);
  const [custStatus, setcustStatus] = useState<any>(2);
  const [sort, setsort] = useState<any>(0);
  const [conctName, setconctName] = useState<any>("");
  const [phoneNum, setphoneNum] = useState<any>("");
  const [pId, setpId] = useState<any>(0);
  const [parentId, setparentId] = useState<any>("");
  const [childId, setchildId] = useState<any>("");
  const [cId, setcId] = useState<any>(0);
  const [childvalue, setchildvalue] = useState<any>("");
  const [parentvalue, setparentvalue] = useState<any>("");
  const [checked, setChecked] = React.useState(false);
  const [OpenCSV, setOpenCSV] = React.useState(false);
  const [custpermit, setcustpermit] = useState<any>([]);
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const [roleid, setroleid] = useState(0);
  const [share, setShare] = useState(false);
  const { register, reset, handleSubmit } = useForm<FormValues>();
  const router = useRouter();
  const [myloadar, setmyloadar] = React.useState(true);
  const [loader, setLoadar] = React.useState(true);

  setTimeout(() => {
    setmyloadar(false);
  }, 2000);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // verify user login and previlegs
  let logintoken: any;
  React.useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
        router.push("/");
      }
    });
    const logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null || logintoken === "") {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      if (res.roleId == 1) {
        setroleid(res.roleId);
      } else if (res.roleId > 1 && res.roleId !== 2) {
        commmonfunctions.ManageCustomers().then((res) => {
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
    UserService.getType().then((response) => setcusttype(response));
  }, []);

  //get customers(users) list
  const getUser = async () => {
    const url = `${api_url}/getuser`;
    setLoadar(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: auth_token,
          "x-access-token": logintoken,
        },
      });
      const res = await response.json();
      const finalres = res.data.users.map((t1: { id: any; }) => ({ ...t1, ...res.data.usersOut.find((t2: { id: any; }) => t2.id === t1.id) }));
      var filteruser = UserService.convert(finalres);
      setUsers(filteruser);
      setsearchdata(filteruser);
      setAll(finalres.length);
      setactive(finalres.filter(
        (dt: any) => dt.status === 1
      ).length);
      setinActive(finalres.filter(
        (dt: any) => dt.status === 0
      ).length);
      settabFilterData(
        UserService.convert(finalres)
      );
      setparentId(
        finalres.filter(
          (dt: any) => dt.GeneratedParentId !== null
        )
      );
      setchildId(
        finalres.filter(
          (dt: any) => dt.GeneratedParentId == null && dt.roleId === 2
        )
      )
      setLoadar(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  //apply filter
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoadar(true);
    setUsers([]);
    const reqData = {
      status: custStatus,
      customerType: custType,
      contactName: conctName,
      number: phoneNum,
      sorting: sort,
      ParentId: pId,
      childId: cId
    }
    await axios({
      method: "POST",
      url: `${api_url}/getUser`,
      data: reqData,
      headers: {
        Authorization: auth_token,
        "x-access-token": logintoken,
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          const datauser = res?.data?.data?.users;
          const useroutstamt = res?.data?.data?.usersOut;
          const finalres = datauser.map((t1: { id: any; }) => ({ ...t1, ...useroutstamt.find((t2: { id: any; }) => t2.id === t1.id) }));
          if (reqData.ParentId <= 0 && finalres.length > 0) {
            var filteruser = UserService.convert(finalres);
            setUsers(filteruser);
            setPage(1);
            DATA.jump(1);
          } else if (reqData.ParentId > 0) {
            const parent = await UserService.getParentDetails(reqData.ParentId);
            const finalprt = parent?.users.map((t1: { id: any; }) => ({ ...t1, ...parent?.usersOut.find((t2: { id: any; }) => t2.id === t1.id) }));
            setUsers(UserService.convert(finalres?.concat(finalprt).reverse()));
            setPage(1);
            DATA.jump(1);
          } else {
            setUsers("");
            setLoadar(false);
            setPage(1);
            DATA.jump(1);
          }
        }
        setLoadar(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //reset filter value
  function ResetFilterValue() {
    reset();
    setCustType(0);
    setcustStatus(2);
    setsort(0);
    setconctName("");
    setphoneNum("");
    setpId(0);
    setcId(0);
    setparentvalue("");
    setchildvalue("");
    getUser();
  }

  // apply searching
  const handleSearch = (e: any) => {
    setsearchquery(e.target.value);
    setPage(1);
    DATA.jump(1);
    if (e.target.value === "") {
      setUsers(searchdata);
    } else {
      const filterres = searchdata.filter((item: any) => {
        return (
          item?.isParentId
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item?.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.email1?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.contactName
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          `${item?.phone1}`.includes(e.target.value) ||
          `${item?.outamount}`.includes(e.target.value)
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
  // delete user from portal
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
        getSageDeleteId();
        toast.success("User Deleted Successfully");
        setdeleteConfirmBoxOpen(false);
        getUser();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  //delete from sage
  async function getSageDeleteId() {
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${deleteData?.id}`,
      headers: {
        Authorization: auth_token,
        "x-access-token": logintoken,
      },
    })
      .then((data: any) => {
        AddLogs(
          userUniqueId,
          `Delete User id - #CUS-${data?.data?.data[0]?.customerId}`
        );
        setdeleteConfirmBoxOpen(false);
        getUser();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  //open close popup boxes
  function handleNewCustomerOpen() {
    setnewCustOpen(true);
  }
  const closePoP = (data: any) => {
    getUser();
    setnewCustOpen(false);
  };

  //edit customer popup
  function handleEditCustomerOpen(id: any) {
    seteditCustOpen(true);
    seteditid(id);
  }
  const closeEditPoP = (data: any) => {
    seteditCustOpen(false);
    //getUser();
  };

  //tab functionality
  function handleAll() {
    setUsers(searchdata);
  }
  function handleActive() {
    const act = tabFilterData.filter((a: any) => a.status === 1);
    setUsers(act);
  }
  function handleInActive() {
    const Inact = tabFilterData.filter((a: any) => a.status === 0);
    setUsers(Inact);
  }

  //send email functionality
  function handleShare(id: any) {
    setUserId(id);
    setShare(true);
  }

  const handleEmailClose = () => setShare(false);
  // send email func
  const handleSend = async () => {
    const reqData = {
      id: UserId,
    };
    await axios({
      method: "POST",
      url: `${api_url}/sendUserEmail`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        toast.success(" Email Sent Successfully");
        setShare(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(" Internal Server Error");
      });
  };

  //admin login for customer section
  const AdminLoginForCustomer = async (email: string) => {
    const reqData = {
      email1: email,
      identifier: "admin_login_for_customer"
    }
    await axios({
      method: "POST",
      url: `${api_url}/userlogin`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          toast.success("Customer Login Successfully");
          const role = res.data.data.role_id;
          const get_loginToken: any = localStorage.getItem("QIS_loginToken");
          const login_user: any = localStorage.getItem("QIS_User");
          localStorage.setItem("Admin_for_Cusromer_QIS_loginToken", get_loginToken);
          localStorage.setItem("Admin_for_Cusromer_QIS_User", login_user);
          localStorage.setItem("QIS_loginToken", res.data.loginToken);
          localStorage.setItem("QIS_User", res.data.data.name);
          const redirect = () => {
            if (role === 1) {
              router.push("/admin/dashboard");
              localStorage.setItem("user", "admin");
            } else if (role === 2) {
              router.push("/user/dashboard");
              localStorage.setItem("user", "user");
            } else {
              router.push("/userprofile");
            }
          };
          setTimeout(redirect, 2000);
        }
      })
      .catch((error) => {
        toast.error("Invalid Credentials!");
      });
  }
  //refresh fuctionality
  const Refresh = () => {
    getUser();
  }

  //sorting functionality
  const DataSort = () => {
    setUsers([...users].reverse());
  }

  //check uncheck functionality
  const [userinfo, setUserInfo] = useState<any>({
    id: [],
  });
  const handleChanges = (e: any) => {
    const { value, checked } = e.target;
    const { id } = userinfo;
    if (checked) {
      setUserInfo({
        id: [...id, value],
      });
    } else {
      setUserInfo({
        id: id.filter((e: any) => e !== value),
      });
    }
  };
  function handleCheck(e: any) {
    var isChecked = e.target.checked;
    setChecked(isChecked);
    // var item = e.target.value;
    // console.log(item);
  }
  // Export to CSV
  const [mydata, setmydata] = useState<any>("");
  const [myload, setmyload] = useState(false);
  function ExportCSV() {
    let datas: {
      name: string;
      email1: string;
      email2: string;
      phone1: number;
      phone2: number;
      CustomerType: string;
      contactName: string;
      printUs: string;
      status: string;
    }[] = [];
    if (userinfo.id.length > 0) {
      const ids = userinfo.id.join(",");
      const getUserByMultipleids = async () => {
        setmyload(true);
        const url = `${api_url}/getuserbymultipleid/${ids}`;
        try {
          const response = await fetch(url, {
            method: "get",
            headers: {
              Authorization: auth_token,
              "x-access-token": logintoken,
            },
          });
          const res = await response.json();
          if (res.data) {
            setmyload(false);
            res.data.map((item: any, key: any) => {
              datas.push({
                name: item.name,
                email1: item.email1,
                email2: item.email2,
                phone1: item.phone1,
                phone2: item.phone2,
                CustomerType: item.CustomerType,
                contactName: item.contactName,
                printUs: item.printUs,
                status: item.status === 1 ? "Active" : "InActive",
              });
            });
            setmydata(datas);
            setOpenCSV(true);
            setTimeout(() => {
              setOpenCSV(false);
              setUserInfo({
                id: [],
              });
            }, 1000);
          }
        } catch (error) {
          console.log("error", error);
        }
      };
      getUserByMultipleids();
    } else {
      toast.error("Please Select Atleast One Customer !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email1" },
    { label: "Alternate Email", key: "email2" },
    { label: "Phone Number", key: "phone1" },
    { label: "Altername Number", key: "phone2" },
    { label: "Contact Name ", key: "contactName" },
    { label: "Print Us ", key: "printUs" },
    { label: "Customer Type ", key: "CustomerType" },
    { label: "status", key: "status" },
  ];

  return (
    <>
      {OpenCSV && mydata.length > 0 ? (
        <CSVDownload data={mydata} headers={headers} />
      ) : (
        ""
      )}
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
                        href="/admin/customer/customerslist"
                        style={{ color: "#7D86A5", textDecoration: "none" }}
                      >
                        Customers
                      </Link>
                    </Breadcrumbs>
                  </Stack>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ fontWeight: "bold", color: "#333333" }}
                  >
                    CUSTOMERS
                  </Typography>
                </Stack>
                {(custpermit && custpermit.canAdd === true) || roleid === 1 ? (
                  <Button
                    className="button-new"
                    variant="contained"
                    size="small"
                    sx={{ width: 150 }}
                    onClick={handleNewCustomerOpen}
                  >
                    <b>New Customer</b>
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
                      >
                        <Tab
                          className="filter-list"
                          label={`All (${All})`}
                          {...a11yProps(0)}
                          onClick={handleAll}
                        />
                        <Tab
                          label={`ACTIVE (${active})`}
                          {...a11yProps(1)}
                          onClick={handleActive}
                        />
                        <Tab
                          label={`INACTIVE (${inActive})`}
                          {...a11yProps(2)}
                          onClick={handleInActive}
                        />
                      </Tabs>
                    </Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      className="fimport-export-box"
                    >
                      <MenuItem onClick={DataSort}>
                        <span style={{ color: "#1a70c5", fontWeight: "600", marginTop: "8px" }}><FilterListIcon /></span>
                        &nbsp; <span style={{ color: "#1a70c5", fontWeight: "600", marginRight: "10px" }}>Sort</span>
                      </MenuItem>
                      <MenuItem onClick={Refresh}>
                        <span style={{ color: "#1a70c5", fontWeight: "600", marginTop: "8px" }}><CachedIcon /></span>
                        &nbsp; <span style={{ color: "#1a70c5", fontWeight: "600", marginRight: "10px" }}>REFRESH</span>
                      </MenuItem>
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <Box>
                            <MenuItem {...bindTrigger(popupState)}>
                              <BiFilterAlt />
                              &nbsp; Filter
                            </MenuItem>
                            <Menu {...bindMenu(popupState)}>
                              <Container
                                className="filter-box"
                                style={{ padding: "0" }}
                              >
                                <Grid>
                                  <Typography variant="h5">
                                    <b>Filter</b>
                                  </Typography>
                                  <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack
                                      style={{ marginTop: "10px" }}
                                      className="form-filter"
                                    >
                                      <Grid container spacing={2}>
                                        <Grid item xs={12} md={3}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="name">
                                              Customer Type
                                            </InputLabel>
                                            <FormControl fullWidth>
                                              <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                size="small"
                                                onChange={(e: any) =>
                                                  setCustType(e.target.value)
                                                }
                                                value={custType}
                                              >
                                                <MenuItem value={0}>
                                                  All
                                                </MenuItem>
                                                {custtype &&
                                                  custtype.map(
                                                    (data: any, key: any) => {
                                                      return (
                                                        <MenuItem
                                                          key={key}
                                                          value={data.id}
                                                        >
                                                          {data.name}
                                                        </MenuItem>
                                                      );
                                                    }
                                                  )}
                                              </Select>
                                            </FormControl>
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={3}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="enddate">
                                              Customer Status
                                            </InputLabel>
                                            <FormControl fullWidth>
                                              <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                size="small"
                                                onChange={(e: any) =>
                                                  setcustStatus(e.target.value)
                                                }
                                                value={custStatus}
                                              >
                                                <MenuItem value={2}>
                                                  All
                                                </MenuItem>
                                                <MenuItem value={1}>
                                                  Active
                                                </MenuItem>
                                                <MenuItem value={0}>
                                                  InActive
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="Price">
                                              Parent Name (Id)
                                            </InputLabel>
                                            <Autocomplete
                                              id="combo-box-demo"
                                              value={parentvalue === "" ? null : parentvalue}
                                              options={parentId}
                                              getOptionLabel={(option: any) =>
                                                option.name +
                                                " (" +
                                                option.isParentId +
                                                ") "
                                              }
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  placeholder="Search Parent by (Name or Id)..."
                                                />
                                              )}
                                              onChange={(event, newValue) => {
                                                setpId(newValue?.id);
                                                setparentvalue(newValue);
                                              }}
                                            />
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={3}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="contactname">
                                              Child Name (Id)
                                            </InputLabel>
                                            <FormControl fullWidth>
                                              <Autocomplete
                                                id="combo-box-demo"
                                                value={childvalue === "" ? null : childvalue}
                                                options={childId}
                                                getOptionLabel={(option: any) =>
                                                  option.name +
                                                  " (" +
                                                  option.customerId +
                                                  ") "
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    placeholder="Search Child by (Name or Id)..."
                                                  />
                                                )}
                                                onChange={(event, newValue) => {
                                                  setcId(newValue?.id);
                                                  setchildvalue(newValue);
                                                }}
                                              />
                                            </FormControl>
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="number">
                                              Phone Number
                                            </InputLabel>
                                            <FormControl fullWidth>
                                              <OutlinedInput
                                                type="text"
                                                id="number"
                                                placeholder="Phone Number..."
                                                fullWidth
                                                size="small"
                                                value={phoneNum}
                                                onChange={(e: any) =>
                                                  setphoneNum(e.target.value)
                                                }
                                              />
                                            </FormControl>
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} lg={3}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="contactname">
                                              Contact Name
                                            </InputLabel>
                                            <FormControl fullWidth>
                                              <OutlinedInput
                                                type="text"
                                                id="contactname"
                                                placeholder="Contact Name..."
                                                fullWidth
                                                size="small"
                                                {...register("contactName")}
                                                value={conctName}
                                                onChange={(e: any) =>
                                                  setconctName(e.target.value)
                                                }
                                              />
                                            </FormControl>
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="sorting">
                                              Sort
                                            </InputLabel>
                                            <FormControl fullWidth>
                                              <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                size="small"
                                                value={sort}
                                                onChange={(e: any) =>
                                                  setsort(e.target.value)
                                                }
                                              >
                                                <MenuItem value={0}>
                                                  Date, Oldest First
                                                </MenuItem>
                                                <MenuItem value={1}>
                                                  Date, Newest First
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
                                        <Grid
                                          item
                                          xs={12}
                                          style={{
                                            marginBottom: "10px",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <Button
                                            size="small"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{ width: 150 }}
                                            onClick={popupState.close}
                                          >
                                            <b>Apply Filter</b>
                                            <span
                                              style={{
                                                fontSize: "2px",
                                                paddingLeft: "10px",
                                              }}
                                            ></span>
                                          </Button>
                                          &nbsp;&nbsp;
                                          <span
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
                                          </span>
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
                      {/* <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <Box>
                            <MenuItem
                              {...bindTrigger(popupState)}
                              onClick={ExportCSV}
                            >
                              Export
                              <KeyboardArrowDownIcon />
                            </MenuItem>
                          </Box>
                        )}
                      </PopupState>
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <Box>
                            <MenuItem
                              {...bindTrigger(popupState)}
                              style={{ border: "none," }}
                            >
                              Import
                              <KeyboardArrowDownIcon />
                            </MenuItem>
                          </Box>
                        )}
                      </PopupState> */}
                      <FormControl>
                        <TextField
                          placeholder="Search by parent id, name, email"
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
                  {loader ? (
                    <Loader />
                  ) : (
                    <div style={{ width: "100%", overflow: "auto" }}>
                      <Table
                        style={{
                          marginTop: "20px",
                          width: "100px",
                          display: "table-caption",
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            {/* <TableCell padding="checkbox">
                              <Checkbox onChange={handleCheck} />
                            </TableCell> */}
                            <TableCell>
                              <Typography width={100}>CUST-ID</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography width={200}>NAME</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography width={250}>EMAIL </Typography>
                            </TableCell>
                            {/* <TableCell>
                              <Typography width={250}>EMAIL 2</Typography>
                            </TableCell> */}
                            <TableCell>
                              <Typography width={150}>CUST. TYPE</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography width={150}>CONT. NAME</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography width={130}>STATUS</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography width={150}>PHONE 1</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography width={150}>PHONE 2</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography width={200}>
                                OUT. STND. AMT(QAR)
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>ACTION</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {DATA.currentData() &&
                            DATA.currentData().map(
                              (dataitem: any, key: any) => {
                                return (
                                  <>
                                    {/* {myload ? (
                                      <Loader />
                                    ) : (
                                      <div> */}
                                    <TableRow
                                      hover
                                      tabIndex={-1}
                                      role="checkbox"
                                      key={key}
                                      className="boder-bottom"
                                    >
                                      {/* <TableCell padding="checkbox">
                                        <Checkbox
                                          onChange={handleChanges}
                                          value={dataitem.id}
                                          //checked={checked}
                                          id={`check` + key}
                                        />
                                      </TableCell> */}
                                      <TableCell align="left">
                                        <Link
                                          href={`/admin/customer/viewcustomer/${dataitem.id}`}
                                        >
                                          {dataitem.isParentId ||
                                            dataitem.customerId}
                                        </Link>
                                      </TableCell>
                                      <TableCell align="left">
                                        {dataitem.name}
                                      </TableCell>
                                      <TableCell align="left">
                                        {/* <a href=""> */}
                                        {dataitem.email1}
                                        {/* </a> */}
                                      </TableCell>
                                      {/* <TableCell align="left">
                                        <a href="">{dataitem.email2}</a>
                                      </TableCell> */}
                                      <TableCell align="left">
                                        {dataitem.CustomerType !== null
                                          ? dataitem.CustomerType
                                          : "INDIVIDUAL"}
                                      </TableCell>
                                      <TableCell align="left">
                                        {dataitem.contactName}
                                      </TableCell>
                                      <TableCell align="left">
                                        {dataitem.status === 1 ? (
                                          <span style={{ color: "#02C509" }}>
                                            ACTIVE
                                          </span>
                                        ) : (
                                          <span style={{ color: "#FF4026" }}>
                                            INACTIVE
                                          </span>
                                        )}
                                      </TableCell>
                                      {/* <TableCell align="left">
                                        {dataitem.printUs}
                                      </TableCell> */}
                                      <TableCell align="left">
                                        {dataitem.phone1}
                                      </TableCell>
                                      <TableCell align="left">
                                        {dataitem.phone2 == 0
                                          ? ""
                                          : dataitem.phone2}
                                      </TableCell>
                                      <TableCell align="left">
                                        {commmonfunctions.formatePrice(
                                          dataitem.outstdamount
                                            ? dataitem.outstdamount
                                            : 0
                                        )}{" "}
                                      </TableCell>
                                      <TableCell align="left">
                                        <Stack
                                          className="action"
                                          direction="row"
                                          spacing={1}
                                        >
                                          <BootstrapTooltip title="Login For Customer">
                                            <Button className="idiv">
                                              <Image
                                                onClick={() =>
                                                  AdminLoginForCustomer(
                                                    dataitem?.email1
                                                  )
                                                }
                                                src="/logincust.png"
                                                alt="Send Welcome Email"
                                                width={45}
                                                height={45}
                                              />
                                            </Button>
                                          </BootstrapTooltip>
                                          <BootstrapTooltip title="Send Welcome Email">
                                            <Button className="idiv">
                                              <Image
                                                onClick={() =>
                                                  handleShare(dataitem.id)
                                                }
                                                src="/share.svg"
                                                alt="Send Welcome Email"
                                                width={35}
                                                height={35}
                                              />
                                            </Button>
                                          </BootstrapTooltip>
                                          {(custpermit &&
                                            custpermit.canView === true) ||
                                            roleid === 1 ? (
                                            <IconButton className="action-view">
                                              <Link
                                                href={`/admin/customer/viewcustomer/${dataitem.id}`}
                                                title="View Customer"
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
                                          {(custpermit &&
                                            custpermit.canEdit === true) ||
                                            roleid === 1 ? (
                                            <IconButton
                                              className="action-edit"
                                              title="Edit Customer"
                                              onClick={() =>
                                                handleEditCustomerOpen(
                                                  dataitem.id
                                                )
                                              }
                                            >
                                              <FiEdit />
                                            </IconButton>
                                          ) : (
                                            ""
                                          )}
                                          {(custpermit &&
                                            custpermit.canDelete === true) ||
                                            roleid === 1 ? (
                                            <IconButton
                                              className="action-delete"
                                              title="Delete Customer"
                                              style={{ color: "#F95A37" }}
                                              onClick={() =>
                                                openDelete(dataitem)
                                              }
                                            >
                                              <RiDeleteBin5Fill />
                                            </IconButton>
                                          ) : (
                                            ""
                                          )}
                                        </Stack>
                                      </TableCell>
                                    </TableRow>
                                    {dataitem?.children?.length > 0 ? (
                                      <>
                                        {dataitem?.children &&
                                          dataitem?.children.map(
                                            (dataitem: any, key: any) => {
                                              return (
                                                <>
                                                  <TableRow className="child-row-table boder-bottom">
                                                    <TableCell align="left">
                                                      <div className="sub-child-box">
                                                        <span className="Child-cust"></span>
                                                        <Link
                                                          href={`/admin/customer/viewcustomer/${dataitem.id}`}
                                                        >
                                                          {" "}
                                                          {dataitem?.customerId}
                                                        </Link>
                                                      </div>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                      {dataitem.name}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                      {/* <a href=""> */}
                                                      {dataitem.email1}
                                                      {/* </a> */}
                                                    </TableCell>
                                                    {/* <TableCell align="left">
                                                      <a href="">
                                                        {" "}
                                                        {dataitem.email2}{" "}
                                                      </a>
                                                    </TableCell> */}
                                                    <TableCell align="left">
                                                      {dataitem.CustomerType !==
                                                        null
                                                        ? dataitem.CustomerType
                                                        : "INDIVIDUAL"}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                      {dataitem.contactName}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                      {dataitem.status === 1 ? (
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
                                                    </TableCell>
                                                    {/* <TableCell align="left">
                                                      {dataitem.printUs}
                                                    </TableCell> */}
                                                    <TableCell align="left">
                                                      {" "}
                                                      {dataitem.phone1}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                      {" "}
                                                      {dataitem?.phone2 == 0 ? "" : dataitem?.phone2}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                      {" "}
                                                      {commmonfunctions.formatePrice(
                                                        dataitem.outstdamount
                                                          ? dataitem.outstdamount
                                                          : 0
                                                      )}{" "}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                      <Stack
                                                        className="action"
                                                        direction="row"
                                                        spacing={1}
                                                      >
                                                        <Button className="idiv">
                                                          <Image
                                                            onClick={() =>
                                                              handleShare(
                                                                dataitem.id
                                                              )
                                                            }
                                                            src="/share.svg"
                                                            alt="Send Welcome Email"
                                                            title="Send Welcome Email"
                                                            width={35}
                                                            height={35}
                                                          />
                                                        </Button>
                                                        {(custpermit &&
                                                          custpermit.canView ===
                                                          true) ||
                                                          roleid === 1 ? (
                                                          <IconButton className="action-view">
                                                            <Link
                                                              href={`/admin/customer/viewcustomer/${dataitem.id}`}
                                                              title="View Customer"
                                                              style={{
                                                                color:
                                                                  "#26CEB3",
                                                              }}
                                                            >
                                                              <BiShow />
                                                            </Link>
                                                          </IconButton>
                                                        ) : (
                                                          ""
                                                        )}
                                                        {(custpermit &&
                                                          custpermit.canEdit ===
                                                          true) ||
                                                          roleid === 1 ? (
                                                          <IconButton
                                                            className="action-edit"
                                                            title="Edit Customer"
                                                            onClick={() =>
                                                              handleEditCustomerOpen(
                                                                dataitem.id
                                                              )
                                                            }
                                                          >
                                                            <FiEdit />
                                                          </IconButton>
                                                        ) : (
                                                          ""
                                                        )}
                                                        {(custpermit &&
                                                          custpermit.canDelete ===
                                                          true) ||
                                                          roleid === 1 ? (
                                                          <IconButton
                                                            className="action-delete"
                                                            title="Delete Customer"
                                                            style={{
                                                              color: "#F95A37",
                                                            }}
                                                            onClick={() =>
                                                              openDelete(
                                                                dataitem
                                                              )
                                                            }
                                                          >
                                                            <RiDeleteBin5Fill />
                                                          </IconButton>
                                                        ) : (
                                                          ""
                                                        )}
                                                      </Stack>
                                                    </TableCell>
                                                  </TableRow>
                                                </>
                                              );
                                            }
                                          )}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {/* </div>
                                    )} */}
                                  </>
                                );
                              }
                            )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  {users == "" ? (
                    <h3 style={{ marginLeft: "15px" }}>No Record found</h3>
                  ) : (
                    ""
                  )}
                  {users != "" ? (
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
                  ) : (
                    ""
                  )}
                </TableContainer>
              </Card>
            </div>
            <MainFooter />
          </Box>
        </Box>
      ) : (
        ""
      )}
      {newCustOpen ? (
        <AddCustomer open={newCustOpen} closeDialog={closePoP} />
      ) : (
        ""
      )}
      {editCustOpen ? (
        <EditCustomer
          id={editid}
          open={editCustOpen}
          closeDialogedit={closeEditPoP}
        />
      ) : (
        ""
      )}
      <ConfirmBox
        open={deleteConfirmBoxOpen}
        closeDialog={() => setdeleteConfirmBoxOpen(false)}
        title={deleteData?.name}
        deleteFunction={deleteUser}
      />
      <Modal
        open={share}
        onClose={handleEmailClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="ISBOX popup send">
          <div className="Isend">
            <div>
              <h3 className="ehead">Resend Welcome emails</h3>
            </div>
          </div>
          <div className="sendEmailBox">
            <div>
              <Box>
                <BsTelegram
                  onClick={handleSend}
                  className="telegram"
                ></BsTelegram>
              </Box>
            </div>
            <div>
              <h3>Email</h3>
            </div>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
}
