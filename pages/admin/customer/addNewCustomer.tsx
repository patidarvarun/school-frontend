import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
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
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../helper/activityLogs";
import UserService from "../../../commonFunctions/servives";
import { AddParentCmp } from "../../commoncmp/addCustomerCmp";
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
  userRole: String;
  agegroup: number;
  attentionto: number;
  alternatenumber: number;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalcode: number;
};

export default function AddCustomer({
  open,
  closeDialog,
}: {
  open: any;
  closeDialog: any;
}) {
  const [value, setValue] = React.useState(0);
  const [spinner, setshowspinner] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [opens, setOpen] = React.useState(open);
  const [custtype, setcusttype] = React.useState<any>([]);
  const [parentId, setparentId] = React.useState<any>(0);
  const [parentemail, setparentemail] = React.useState<any>("");
  const [parentid, setparentid] = React.useState(0);
  const [parentname, setparentname] = React.useState<any>("");
  const [error, seterror] = React.useState(false);
  const [cretadeBy, setcretadeBy] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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

  React.useEffect(() => {
    UserService.getType().then((response) => setcusttype(response));
    commmonfunctions.VerifyLoginUser().then(res => {
      setcretadeBy(res.id);
    });
  }, []);

  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

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
    if (parentId === 0) {
      seterror(true);
      setshowspinner(false);
      setBtnDisabled(false);
      toast.error("Please Select Parent");
      return false;
    }
    const reqData = {
      name: data.name,
      email1: parentemail,
      email2: data.email2,
      typeId: data.customertype,
      phone1: data.number,
      contactName: data.contactName,
      printUs: data.printUs,
      status: data.status,
      agegroup: data.agegroup,
      attentionto: data.attentionto,
      phone2: data.alternatenumber,
      useraddress: address,
      roleId: 2,
      parentId: parentId,
      userRole: "customer",
      createdby: cretadeBy
    };
    await axios({
      method: "POST",
      url: `${api_url}/addUser`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        if (data) {
          setshowspinner(false);
          setBtnDisabled(false);
          AddLogs(cretadeBy, `Customer Added by id - #CUS${(data?.data?.sageuserid)}`);
          toast.success("Customer Added Successfully");
          closeDialog(false);
          setTimeout(() => {
            setOpen(false);
          }, 2000);
        }
      })
      .catch((error) => {
        toast.error("Email Already Registered");
        setshowspinner(false);
        setBtnDisabled(false);
      });
  };

  const closeDialogs = () => {
    closeDialog(false);
    setOpen(false);
  };

  const Getdata = (item: any) => {
    console.log(item);
    if (item) {
      setparentId(item.id);
      setparentemail(item.email)
    }
  };

  return (
    <BootstrapDialog
      onClose={closeDialog}
      aria-labelledby="customized-dialog-title"
      open={opens}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={closeDialogs}>
        Create New Customer
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box sx={{ width: "100%" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Basic" {...a11yProps(0)} />
                <Tab label="Address" {...a11yProps(1)} />
                <Tab label="Options" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Grid>
                <Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">
                          Customer Name <span className="err_str">*</span>
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
                          <span style={style}>Name can't be blank *</span>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
                <Stack style={{ marginTop: "25px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">
                          Phone Number 
                          {/* <span className="err_str">*</span> */}
                        </InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Phone..."
                          fullWidth
                          size="small"
                          {...register("number")}
                          // , {
                          //   required: true,
                          //   pattern: /^[0-9+-]+$/,
                          //   minLength: 10,
                          //   maxLength: 10,
                          // })}
                        />
                        {errors.number?.type === "required" && (
                          <span style={style}>Field is Required *</span>
                        )}
                        {errors.number?.type === "pattern" && (
                          <span style={style}>Enter Valid Number *</span>
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
                          Email
                          {/* <span className="err_str">*</span> */}
                        </InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Email..."
                          fullWidth
                          size="small"
                          // defaultValue={parentemail ? parentemail : ""}
                          value={parentemail ? parentemail : ""}
                          onChange={(e) => setparentemail(e.target.value)}
                        // {...register("email1", {
                        //   required: true,
                        //   pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        //   validate: (value) => { return !!value.trim() }
                        // })}
                        />
                        {/* {errors.email1?.type === "required" && (
                          <span style={style}>Field is Required *</span>
                        )}
                        {errors.email1?.type === "pattern" && (
                          <span style={style}>
                            Please enter a valid email address *
                          </span>
                        )}
                        {errors.email1?.type === "validate" && (
                          <span style={style}>
                            Please enter a valid email address *
                          </span>
                        )} */}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
                <Stack style={{ marginTop: "25px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">Status</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={1}
                            size="small"
                            {...register("status")}
                          >
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={0}>InActive</MenuItem>
                          </Select>
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
            <TabPanel value={value} index={1}>
              <Grid>
                <Stack>
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
                <Stack style={{ marginTop: "25px" }}>
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
                <Stack style={{ marginTop: "25px" }}>
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
                        <InputLabel htmlFor="name">State/Province</InputLabel>
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
            <TabPanel value={value} index={2}>
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
                            defaultValue={0}
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
                <Stack style={{ marginTop: "20px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <InputLabel htmlFor="name">
                        Select Parent <span className="err_str">*</span>
                      </InputLabel>
                      {/* <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={(e) => setCheck(e.target.checked)}
                              value={Check}
                            />
                          }
                          label="Belongs to a parent customer"
                        />
                      </FormGroup> */}
                      <Stack spacing={1}
                      // style={hideshowstyle}
                      >
                        <InputLabel htmlFor="name"></InputLabel>
                        <AddParentCmp Data={Getdata} PId={parentid} pname={parentname} />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
                {error === true && (
                  <span style={style}>Field is Required *</span>
                )}
                <Stack style={{ marginTop: "15px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
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
                          {...register("contactName", { required: true, validate: (value) => { return !!value.trim() } })}
                        />
                        {errors.contactName?.type === "required" && (
                          <span style={style}>Field is Required *</span>
                        )}
                        {errors.contactName?.type === "validate" && (
                          <span style={style}>Field can't be blank *</span>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">
                          Print Us <span className="err_str">*</span>
                        </InputLabel>
                        <OutlinedInput
                          type="text"
                          id="name"
                          placeholder="Print Us..."
                          fullWidth
                          size="small"
                          {...register("printUs", { required: true, validate: (value) => { return !!value.trim() } })}
                        />
                        {errors.printUs?.type === "required" && (
                          <span style={style}>Field is Required *</span>
                        )}
                        {errors.printUs?.type === "validate" && (
                          <span style={style}>Field can't be blank *</span>
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
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={1}
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
                          </Select>
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
                <b>Create</b>
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
