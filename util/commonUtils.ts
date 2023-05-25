import  fs from 'fs'
// var config = require('../helper/config');
// var config = require('../helper/config');
import {IS_CERT_AUTH_ENABLED,AMEX_TOKEN,BASEURL,API_VERSION,MERCHANTID,DB_BASE_URL} from '../helper/config'

const config :any ={
    IS_CERT_AUTH_ENABLED,
    BASEURL,
    API_VERSION,
    MERCHANTID,
    DB_BASE_URL,
    AMEX_TOKEN
  }
class commonUtils {
    keyGen = (keyLength:any) => {
        var i, key = "", characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charactersLength = characters.length;
        for (i = 0; i < keyLength; i++) {
            key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
        }
        return key;
    };
    
    // getCurrency=(keyLength)=> {
    //     return config.CURRENCY;
    // };
//    setAuthentication = (config, options)=> {
//         if (config.IS_CERT_AUTH_ENABLED === 'true') {
//             options.agentOptions = {
//                 cert: fs.readFileSync(config.SSL_FILES.CRT),
//                 key: fs.readFileSync(config.SSL_FILES.KEY),
//                 passphrase: config.PKI_GATEWAY.MERCHANTID
//             }
//         } else {
//             options.auth = {
//                 // user: config.TEST_GATEWAY.USERNAME,
//                 // pass: config.TEST_GATEWAY.PASSWORD,
//                 user: "merchant.TEST9767612138",
//                 pass: "094bf4ffe5c1b4f9e55f56c15ac534e1",
//                 sendImmediately: false
//             };
//         }
//     };
    
    getBaseUrl=(config:any) =>{
        console.log("config base",config.BASEURL);
        return (config.IS_CERT_AUTH_ENABLED) ? config.PKI_GATEWAY.BASEURL : config.BASEURL;
    };
     getApiVersion =(config:any) =>{
        return (config.IS_CERT_AUTH_ENABLED) ? config.PKI_GATEWAY.API_VERSION : config.API_VERSION;
    };
     getMerchantId =(config:any) =>{
        return (config.IS_CERT_AUTH_ENABLED) ? config.PKI_GATEWAY.MERCHANTID : config.MERCHANTID;
    };
    
     getPkiMerchantUrl =(config:any) =>{
        return getSelfBaseUrl(config) + "/api/rest/version/" + config.PKI_GATEWAY.API_VERSION + "/merchant/" + config.PKI_GATEWAY.MERCHANTID;
    };
    
    getTestMerchantUrl =(config:any) =>{
        return getSelfBaseUrl(config) + "/api/rest/version/" + config.API_VERSION + "/merchant/" + config.MERCHANTID;
    };

}


function getSelfBaseUrl(config:any){
    return (config.IS_CERT_AUTH_ENABLED) ? config.PKI_GATEWAY.BASEURL : config.BASEURL;
}

export default new commonUtils();