import axios from "axios";
import { api_url, auth_token } from "../helper/config";

export const AddLogs = async (userId:number,message:string) => {
    const reqData = {
        userid: userId,
        message:message,
      };
    await axios({
        method: "POST",
        url: `${api_url}/addlogsactivity`,
        data: reqData,
        headers: {
          Authorization: auth_token,
        },
      }).then((result: any) => {
        console.log("@");
      }).catch((error: any) => {
        console.log("error =>", error);
      });
}
