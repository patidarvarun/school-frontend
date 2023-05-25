import { Autocomplete, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { api_url, auth_token } from "../../helper/config";

export default function AddCustomerName({ Data, PId, pname }: { Data: any, PId: any, pname: any }) {
  const [users, setUsers] = useState<any>([]);
  const [opens, setOpens] = React.useState(false);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<any>({ id: PId, title: pname });

  useEffect(() => {
    getUser();
  }, []);

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
      setUsers(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const option: { id: number; title: string,customerId:string }[] = [];
  users &&
    users.map((data: any, key: any) => {
      return option.push({
        id: data.id,
        title: data.name,
        customerId:data.customerId
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
            placeholder="Search or Select Customer"
          />
        )}
        noOptionsText={
              <span style={{color:"red"}}>
                The customer doesn't exist with this name. 
              </span>
        }
      />
    </>
  );
}
