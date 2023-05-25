import crypto  from 'crypto';
const SECRET_KEY :any = process.env.NEXT_PUBLIC_CBQ_SECERET_KEY  || "88bfaf1eeaf3437aace1f2c46da8547512beb17bbf6d43c19e758114ddd874db3696a3be4abf416b8abaa3009201621a0428ded05acf40da8b24d397330a39d1474f47d0a94243aeb15d65a7e8985a5e6d25e7e95c3e4512bc0f369fc879c8fad369eba23c8b415b803fb7f3263486db49bca3ed5a5c4e9c882a0762fe9503dc" 

class qpayConfig {
//new Date().toISOString()

    sign =(params:any) =>{
        console.log("Date =>",new Date().toISOString());
        console.log("this.buildDataToSign(params) =>",this.buildDataToSign(params));
      return this.signData(this.buildDataToSign(params), SECRET_KEY);
    };
    
    
     signData = (data:any, secretKey:any) =>{
        // console.log("data =>",data);
        // console.log("secretKey =>",secretKey);
        // const hash = crypto.createHash('sha256').update(secretKey).digest('base64');
        const hash = crypto.createHmac('sha256',secretKey).update(data).digest('base64')
        console.log("hase =>",hash);
          return hash ;
        // return base64_encode(hash_hmac('sha256', data, secretKey, true));
    }
    
  buildDataToSign =(params:any)=> {
    
                let dataToSign : any = [] ;
                // let signedFieldNames = (params['signed_field_names'])
                // let signedFieldNamesArray = signedFieldNames.split(',')
               
                // for(var i=0 ; i < signedFieldNamesArray.length ;i++){
                //     // let element = `${signedFieldNamesArray[i]}=${params[signedFieldNamesArray[i]]}`
                   
                //     dataToSign.push(element)
                // }

                for(var key in params){
                    dataToSign.push(params[key])
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
    

}
export default new qpayConfig();