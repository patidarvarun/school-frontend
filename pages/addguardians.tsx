import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import { type } from "os";
import MiniDrawer from "./sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Container,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  IconButton,
  TextareaAutosize,
  styled,
  Typography,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

import axios from "axios";
import { CleaningServices } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { json } from "stream/consumers";
import { api_url, base_url } from "./../helper/config";

export interface FormValues {
  append(arg0: string, firstname: String): unknown;
  firstname: String;
  lastname: String;
  email: String;
  contact: String;
  token: String;
  firstName: String;
  lastName: String;
  image: any;
  type: any;
}

export default function ADDGuardians() {
  const [token, setToken] = useState<FormValues | any>("");
  const [image, setImage] = useState<FormValues | any>("");

  // let token = localStorage.getItem('token')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    let imageData = new FormData();
    imageData.append("image", image);
    imageData.append("firstName", data.firstname);
    imageData.append("lastName", data.lastname);
    imageData.append("email", data.email);
    imageData.append("contact", data.contact);
    imageData.append("status", "0");
    imageData.append("role_id", "1");

    // let studentData = new FormData();
    // studentData.append("firstName", data?.firstName);
    // studentData.append("lastName", data?.lastName);

    // const userData = {
    //   firstName: data.firstname,
    //   lastName: data.lastname,
    //   email: data.email,
    //   contact: data.contact,
    //   image: imageData,
    //   status: 1,
    //   password: "1233344444",
    //   role_id: 1,
    // };
    const studentData = {
      firstName: data.firstName,
      lastName: data.lastName,
    };
    //   const end_point = "addactivity";
    await axios({
      method: "POST",
      url: `${api_url}adduser`,
      data: imageData,

      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    })
      .then((data) => {
        let userId = data.data.User.insertId;
        addStudent(studentData, userId);
      })
      .catch((error) => {});
  };
  const addStudent = async (student: any, userId: any) => {
    let studentData = new FormData();
    studentData.append("firstName", student.firstName);
    studentData.append("lastName", student.lastName);
    studentData.append("user_id", userId);
    // const requestdata = {
    //   firstName: student.firstName,
    //   lastName: student.lastName,
    //   user_id: userId,
    // };
    await axios({
      method: "POST",
      url: `${api_url}addstudent`,
      data: studentData,

      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    }).then((res) => {
      if (res) {
        router.push("/guardians");
      }
    });
  };
  const style = {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const router = useRouter();
  const BootstrapButton = styled(Button)({
    backgroundColor: "red",
    "&:hover": {
      backgroundColor: "red",
    },
  });
  const { id } = router.query;

  useEffect(() => {
    const { id } = router.query;

    fetch(`${process.env.NEXT_PUBLIC_DB_BASE_URL}/api/get_authorization_token`)
      .then((response) => response.json())
      .then((res) => {
        setToken(res.token);
      })

      .catch((err: any) => {});
  }, []);

  const handleCancel = () => {
    router.push("/guardians");
  };

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MiniDrawer />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div id="editContent">
              <div id="left">
                <div className="imgs">
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    style={{ marginBottom: "5PX" }}
                  >
                    {image ? (
                      <Avatar
                        alt="Remy Sharp"
                        src={`${URL.createObjectURL(image)}`}
                        sx={{ width: 204, height: 204 }}
                      />
                    ) : (
                      ""
                    )}
                    <div className="igs">
                      <Button variant="contained" component="label">
                        Upload Image
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          {...register("image", {
                            required: true,
                          })}
                          onChange={uploadToClient}
                        />
                        <PhotoCamera />
                      </Button>
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                      ></IconButton>
                    </div>
                    <Typography style={style}>
                      {errors.image && <span>image Feild is Required **</span>}
                    </Typography>
                  </Stack>
                  {/* <Avatar
                    alt="Remy Sharp"
                    src="/image.png"
                    sx={{ width: 204, height: 204 }}
                  /> */}
                  &nbsp;
                </div>
                {/* <div className="upload">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                  >
                    <PhotoCamera />
                  </IconButton>
                  <input type="file" name="myImage" onChange={uploadToClient} />
                  Upload Image
                </div> */}
              </div>
              <div>
                <div id="right">
                  <div className="editform">
                    <h1 className="heading">Add GURADIAN INFO</h1>
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { m: 1, width: "35ch" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <div>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="name">
                                First Name <span className="err_str">*</span>
                              </InputLabel>
                              <OutlinedInput
                                id="name"
                                type="name"
                                {...register("firstname", {
                                  required: true,
                                })}
                                placeholder="Activity Name..."
                                fullWidth
                              />
                              <Typography style={style}>
                                {errors.firstname && (
                                  <span>firstName Feild is Required **</span>
                                )}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="lastname">
                                Last Name <span className="err_str">*</span>
                              </InputLabel>
                              <OutlinedInput
                                fullWidth
                                id="lastname"
                                type="lastname"
                                {...register("lastname", {
                                  required: true,
                                })}
                                placeholder="lastname..."
                              />
                              <Typography style={style}>
                                {errors.lastname && (
                                  <span>lastName Feild is Required **</span>
                                )}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="email">
                                Email <span className="err_str">*</span>
                              </InputLabel>
                              <OutlinedInput
                                fullWidth
                                id="email"
                                type="email"
                                {...register("email", {
                                  required: true,
                                })}
                                placeholder="email.."
                              />
                              <Typography style={style}>
                                {errors.email && (
                                  <span>email Feild is Required **</span>
                                )}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="contact">
                                Contact <span className="err_str">*</span>
                              </InputLabel>
                              <OutlinedInput
                                fullWidth
                                id="conatct"
                                {...register("contact", {
                                  required: true,
                                })}
                                placeholder="contact..."
                              />
                              <Typography style={style}>
                                {errors.contact && (
                                  <span>contact Feild is Required **</span>
                                )}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </div>
                    </Box>
                  </div>
                  <div className="stuform">
                    <h1 className="heading">Add STUDENT INFO </h1>
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { m: 1, width: "35ch" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <div>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="status">
                                First Name <span className="err_str">*</span>
                              </InputLabel>
                              <OutlinedInput
                                fullWidth
                                id="firstName"
                                placeholder="firstName..."
                                {...register("firstName", {
                                  required: true,
                                })}
                              />
                              <Typography style={style}>
                                {errors.firstName && (
                                  <span>firstName Feild is Required **</span>
                                )}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="status">
                                Last Name <span className="err_str">*</span>
                              </InputLabel>
                              <OutlinedInput
                                fullWidth
                                id="status"
                                placeholder="lastName..."
                                {...register("lastName", {
                                  required: true,
                                })}
                              />
                              <Typography style={style}>
                                {errors.lastName && (
                                  <span>lastName Feild is Required **</span>
                                )}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>

                        {/* <div>
                      
                      </div> */}
                      </div>
                      {/* <Button onClick={handleSubmit} type="button">
                      cancel
                    </Button> */}
                    </Box>
                  </div>
                  <div className="butto">
                    <div className="btn">
                      <Button className="edit" type="submit">
                        Add
                      </Button>
                    </div>
                    <div className="btns">
                      <BootstrapButton onClick={handleCancel} type="button">
                        cancel
                      </BootstrapButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Box>
      </Box>
    </>
  );
}
