import crypto  from 'crypto';
import  {CBQ_SECRET_KEY} from './config';

const SECRET_KEY :any = process.env.NEXT_PUBLIC_TEST_GATEWAY_URL 

class cyberSourceSecureConfig {
//new Date().toISOString()

    sign =(params:any) =>{
        console.log("Date =>",new Date().toISOString());
        console.log("this.buildDataToSign(params) =>",this.buildDataToSign(params));
      return this.signData(this.buildDataToSign(params));
    };
    
    
     signData = (data:any) =>{
         console.log("data =>",data);
         console.log("secretKey =>",CBQ_SECRET_KEY);
        // const hash = crypto.createHash('sha256').update(secretKey).digest('base64');
        const hash = crypto.createHmac('sha256',CBQ_SECRET_KEY).update(data).digest('base64')
        console.log("hase =>",hash);
        return hash ;
        // return base64_encode(hash_hmac('sha256', data, secretKey, true));
    }
    
  buildDataToSign =(params:any)=> {
    
                let dataToSign : any = [] ;
                let signedFieldNames = (params['signed_field_names'])
                let signedFieldNamesArray = signedFieldNames.split(',')
               
                for(var i=0 ; i < signedFieldNamesArray.length ;i++){
                    let element = `${signedFieldNamesArray[i]}=${params[signedFieldNamesArray[i]]}`
                   
                    dataToSign.push(element)
                }
           console.log("dataToSign =>",dataToSign);
           
            // console.log("data =>",dataToSign);
            // return signedFieldNames
            // signedFieldNames = explode(",",params["signed_field_names"]);
            // foreach (signedFieldNames as field) {
            //    dataToSign[] = field . "=" . params[field];
            // }
            return this.commaSeparate(dataToSign);
           
    }
    
  commaSeparate = (dataToSign:any) =>{
        return dataToSign.join(',');
        // return implode(",",dataToSign);
    }

    hashEncrypted =async(params:any) =>{
      const textAsBuffer = new TextEncoder().encode(params);
      const hashBuffer = await window.crypto.subtle.digest(
        "SHA-256",
        textAsBuffer
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
      return hash;
  };
  
    

}
export default new cyberSourceSecureConfig();