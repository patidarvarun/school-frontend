import { Autocomplete, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api_url, auth_token } from "../../helper/config";
import moment from "moment";
export default function AddActivity({ Data, PId, pname }: any) {
  const [users, setUsers] = useState<any>([]);
  const [opens, setOpens] = React.useState(false);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<any>({ id: PId, title: pname });

  useEffect(() => {
    getUser();
  }, []);
  let todayDatee=new Date();
  const todayDate = moment(todayDatee,"DD MM YYYY").format("YYYY.MM.DD");

  const getUser = async () => {
    const url = `${api_url}/getActivity`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      let newData = res.data.filter((ea:any)=>{
      return ea.startDate >= todayDate
    })
      setUsers(newData);
    } catch (error) {
      console.log("error", error);
    }
  };
  const option: { id: number; title: string; price: number,Iid:string}[] = [];
  users &&
    users.map((data: any, key: any) => {
      return option.push({
        id: data.id,
        title: data.name,
        price: data.price,
        Iid:data.Iid
      });
    });
  return (
    <>
      <Autocomplete
        size="small"
        value={value}
        inputValue={inputValue}
        onChange={(event, newValue) => {

          setValue(newValue);
          Data(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={option}
        getOptionLabel={(option) => option.title || ""}
        isOptionEqualToValue={(option, title) => option.title === value.title}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Search or Select Service"


          />
        )}
        noOptionsText={
          <span style={{ color: "red" }}>
            The service doesn't exist with this name.
          </span>
        }
      />
    </>
  );
}
