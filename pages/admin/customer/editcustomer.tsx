import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { api_url, auth_token } from "../../../helper/config";
import AddCustomerCmp from "../../commoncmp/addCustomerCmp";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../helper/activityLogs";
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
          <CloseIcon />
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type FormValues = {
  name: string;
  status: number;
  customertype: number;
  email1: string;
  email2: string;
  number: number;
  contactName: string;
  printUs: string;
  parentId: number;
  agegroup: number;
  pregeneratedid: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalcode: number;
  attentionto: number;
  alternatenumber: number;
};

export default function EditCustomer({
  id,
  open,
  closeDialogedit,
}: {
  id: any;
  open: any;
  closeDialogedit: any;
}) {
  const [selvalue, setselValue] = React.useState(0);
  const [spinner, setshowspinner] = React.useState(false);
  const [opens, setOpen] = React.useState(open);
  const [parentid, setparentid] = React.useState(0);
  const [parentname, setparentname] = React.useState<any>("");
  const [custtype, setcusttype] = React.useState<any>([]);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [status, setstatus] = React.useState<any>("");
  const [agegrp, setagegrp] = React.useState<any>("");
  const [custType, setcustType] = React.useState<any>("");
  const [custAdd, setcustAdd] = React.useState<any>("");
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setselValue(newValue);
  };
  const [Check, setCheck] = React.useState(false);
  if (Check === true) {
    var hideshowstyle = {
      display: "block",
    };
  } else {
    var hideshowstyle = {
      display: "none",
    };
  }

  if (parentid > 0) {
    var hideshowstyle = {
      display: "block",
    };
  }

  React.useEffect(() => {
    commmonfunctions.VerifyLoginUser().then(res => {
      setUserUniqId(res?.id)
    });
  }, []);
  React.useEffect(() => {
    getType();
    getUserDet();
    getParentDet();
    if (parentid > 0) {
      setChecked(true);
    }
  }, [status]);

  //get type
  const getType = async () => {
    const url = `${api_url}/getType`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      setcusttype(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  //get user details
  const getUserDet = async () => {
    try {
      const response = await fetch(`${api_url}/getuserdetails/${id}`, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      setValue("name", res.data[0].name);
      setValue("email1", res.data[0].email1);
      setValue("email2", res.data[0].email2);
      setValue("number", res.data[0].phone1);
      setValue("alternatenumber", res.data[0].phone2 === 0 ? "" : res.data[0].phone2);
      setValue("contactName", res.data[0].contactName);
      setValue("printUs", res.data[0].printus);
      setValue("pregeneratedid", res.data[0].generatedId);
      setparentid(res.data[0].parentId);
      setstatus(res.data[0].status);
      setcustType(res.data[0].typeId);
      setagegrp(res.data[0].agegroup);
      setValue("pregeneratedid", res.data[0].generatedId);
      const addr = JSON.parse(res.data[0]?.address);
      setcustAdd(addr);
      setValue("address1", custAdd?.add1);
      setValue("address2", custAdd?.add2);
      setValue("city", custAdd?.city);
      setValue("state", custAdd?.state);
      setValue("postalcode", custAdd?.postalcode);
      setValue("attentionto", res.data[0]?.attentionTo);

    } catch (error) {
      console.log("error", error);
    }
  };
  //get parent
  const getParentDet = async () => {
    try {
      const response = await fetch(`${api_url}/getuserbypid/${parentid}`, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      setparentname(res.data[0].name);
    } catch (error) {
      console.log("error", error);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  async function getSageDeleteId() {
    // let reqData = { isDeleted: 1 };
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${id}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        AddLogs(userUniqueId, `Updated User id - #CUS-${(data?.data?.data[0]?.customerId)}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // submit data
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setshowspinner(true);
    setBtnDisabled(true);
    const address = {
      add1: data.address1,
      add2: data.address2,
      city: data.city,
      state: data.state,
      postalcode: data.postalcode,
    };
    const reqData = {
      name: data.name,
      email1: data.email1,
      email2: data.email2,
      phone1: data.number,
      contactName: data.contactName,
      printUs: data.printUs,
      status: data.status == 1 ? "1" : data.status == 0 ? "0" : "",
      typeId: data.customertype,
      parentId: parentid,
      agegroup: data.agegroup,
      pregeneratedid: data.pregeneratedid,
      updatedBy: 1,
      attentionto: data.attentionto,
      phone2: data.alternatenumber,
      useraddress: address,
    };
    await axios({
      method: "PUT",
      url: `${api_url}/edituser/${id}`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data) => {
        if (data.status === 200) {
          setshowspinner(false);
          setBtnDisabled(false);
          getSageDeleteId();
          toast.success("Customer Updated Successfully");
          setTimeout(() => {
            setOpen(false);
          }, 2000);
          closeDialogedit(data.status);
        }
      })
      .catch((error) => {
        toast.error("Email Already Registered");
        setshowspinner(false);
        setBtnDisabled(false);
      });
  };

  const closeDialogs = () => {
    closeDialogedit(false);
    setOpen(false);
  };

  const Getdata = (item: any) => {
    setparentid(item && item.id);
  };


  return (
    <BootstrapDialog
      onClose={closeDialogs}
      aria-labelledby="customized-dialog-title"
      open={opens}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={closeDialogs}>
        Edit Customer
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box sx={{ width: "100%" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={selvalue}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Basic" {...a11yProps(0)} />
                <Tab label="Address" {...a11yProps(1)} />
                <Tab label="Options" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={selvalue} index={0}>
              <Grid>
                <Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">
                          Customer <span className="err_str">*</span>
                        </InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Customer Name..."
                          fullWidth
                          size="small"
                          {...register("name", {
                            required: true,
                            validate: (value) => { return !!value.trim() }
                          })}
                        />
                        {errors.name?.type === "required" && (
                          <span style={style}>Field is Required *</span>
                        )}
                        {errors.name?.type === "validate" && (
                          <span style={style}>Field can't be blank *</span>
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
                          Phone Number <span className="err_str">*</span>
                        </InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Phone..."
                          fullWidth
                          size="small"
                          {...register("number", {
                            required: true,
                            minLength: 10,
                            maxLength: 10,
                          })}
                        />
                        {errors.number?.type === "required" && (
                          <span style={style}>Field is Required *</span>
                        )}
                        {errors.number?.type === "minLength" && (
                          <span style={style}>Enter Valid Number *</span>
                        )}
                        {errors.number?.type === "maxLength" && (
                          <span style={style}>Enter Valid Number *</span>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">
                          Email <span className="err_str">*</span>
                        </InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Email..."
                          fullWidth
                          size="small"
                          {...register("email1", {
                            required: true,
                            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          })}
                        />
                        {errors.email1?.type === "required" && (
                          <span style={style}>Field is Required *</span>
                        )}
                        {errors.email1?.type === "pattern" && (
                          <span style={style}>
                            Please enter a valid email address *
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
                        <InputLabel htmlFor="name">Status</InputLabel>
                        <FormControl fullWidth>
                          {status !== "" ? (
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              size="small"
                              {...register("status")}
                              defaultValue={status}
                            >
                              <MenuItem value={1}>Active</MenuItem>
                              <MenuItem value={0}>InActive</MenuItem>
                            </Select>
                          ) : (
                            "loading......"
                          )}
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Alternate Email</InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Alternate Email..."
                          fullWidth
                          size="small"
                          {...register("email2")}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </TabPanel>
            <TabPanel value={selvalue} index={1}>
              <Grid>
                <Stack style={{ marginTop: "20px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Attention To</InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Attention To..."
                          fullWidth
                          size="small"
                          {...register("attentionto")}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Phone</InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Phone..."
                          fullWidth
                          size="small"
                          {...register("alternatenumber")}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
                <Stack style={{ marginTop: "20px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Address 1</InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Address1..."
                          fullWidth
                          size="small"
                          {...register("address1")}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Address 2</InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Address2..."
                          fullWidth
                          size="small"
                          {...register("address2")}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
                <Stack style={{ marginTop: "20px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">City</InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="City..."
                          fullWidth
                          size="small"
                          {...register("city")}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">State</InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="State..."
                          fullWidth
                          size="small"
                          {...register("state")}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Zip/Postal Code</InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Postal Code..."
                          fullWidth
                          size="small"
                          {...register("postalcode")}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </TabPanel>
            <TabPanel value={selvalue} index={2}>
              <Grid>
                <Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Customer Type</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            size="small"
                            defaultValue={custType}
                            {...register("customertype")}
                          >
                            <MenuItem value={0}>Individual</MenuItem>
                            {custtype &&
                              custtype.map((data: any, key: any) => {
                                return (
                                  <MenuItem key={key} value={data.id}>
                                    {data.name}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
                {parentid !== 0 ? (<Stack style={{ marginTop: "15px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <InputLabel htmlFor="name">Selected Parent</InputLabel>
                      <Stack spacing={1} style={hideshowstyle}>
                        <InputLabel htmlFor="name"></InputLabel>
                        <AddCustomerCmp
                          Data={Getdata}
                          PId={parentid}
                          pname={parentname}

                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>) : ""}
                <Stack style={{ marginTop: "20px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">
                          Contact Name <span className="err_str">*</span>
                        </InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Contact Name..."
                          fullWidth
                          size="small"
                          {...register("contactName", { required: true })}
                        />
                        {errors.contactName && (
                          <span style={style}>Field is Required *</span>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
                <Stack style={{ marginTop: "15px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Age Group</InputLabel>
                        <FormControl fullWidth>
                          {status !== "" ? (
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              defaultValue={agegrp}
                              size="small"
                              {...register("agegroup")}
                            >
                              <MenuItem value={1}>FS1</MenuItem>
                              <MenuItem value={2}>FS2</MenuItem>
                              <MenuItem value={3}>FS3</MenuItem>
                              <MenuItem value={4}>FS4</MenuItem>
                              <MenuItem value={5}>FS5</MenuItem>
                              <MenuItem value={6}>FS6</MenuItem>
                              <MenuItem value={7}>FS7</MenuItem>
                              <MenuItem value={8}>FS8</MenuItem>
                              <MenuItem value={9}>FS9</MenuItem>
                              <MenuItem value={10}>FS10</MenuItem>
                              <MenuItem value={11}>FS11</MenuItem>
                              <MenuItem value={12}>FS12</MenuItem>
                              <MenuItem value={13}>FS13</MenuItem>
                            </Select>) : ("loadinf...")
                          }
                        </FormControl>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </TabPanel>
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                size="small"
                sx={{ width: 150 }}
                autoFocus
                disabled={btnDisabled}
              >
                <b>Update</b>
                <span style={{ fontSize: "2px", paddingLeft: "10px" }}>
                  {spinner === true ? <CircularProgress color="inherit" /> : ""}
                </span>
              </Button>
            </DialogActions>
          </form>
          <ToastContainer />
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
}
