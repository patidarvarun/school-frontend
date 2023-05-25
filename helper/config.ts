import { decode, encode } from "base-64";

const IS_CERT_AUTH_ENABLED = false;
const BASEURL = process.env.NEXT_PUBLIC_TEST_GATEWAY_URL || "https://amexmena.gateway.mastercard.com";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "62";
const USERNAME = "merchant." + process.env.NEXT_PUBLIC_USERNAME || "TEST9767612138";
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD || "Aemempgs@12";
const MERCHANTID = process.env.NEXT_PUBLIC_USERNAME || "TEST9767612138";
const AMEX_API_PASS = process.env.NEXT_AMEX_API_PASS || "094bf4ffe5c1b4f9e55f56c15ac534e1";
const AMEX_TOKEN =  encode("merchant." + MERCHANTID + ":" + AMEX_API_PASS);
const DB_BASE_URL = process.env.NEXT_PUBLIC_DB_API_BASE_URL;
const AMEX_REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL;


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  name: string;
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}

const base_url = process.env.NEXT_PUBLIC_DB_BASE_URL;
const api_url = process.env.NEXT_PUBLIC_DB_API_BASE_URL;
const qatar_currency = "QAR";

//CBQ////

const CBQ_ACCESS_KEY = "cfc1af4483773756a54a990e585ce7c5";
const CBQ_PROFILE_ID = "70647EEB-EDE3-4859-9DD9-6E4605C9FABE";
const CBQ_MERCHANT_ID = "cbq_qis_qar";
const CBQ_TRANSACTION_TYPE = "sale,create_payment_token";

const CBQ_CURRENCY_CODE = "QAR";
const CBQ_TRANSACTION_URL = "https://testsecureacceptance.cybersource.com/pay";
const CBQ_SECRET_KEY =
  "88bfaf1eeaf3437aace1f2c46da8547512beb17bbf6d43c19e758114ddd874db3696a3be4abf416b8abaa3009201621a0428ded05acf40da8b24d397330a39d1474f47d0a94243aeb15d65a7e8985a5e6d25e7e95c3e4512bc0f369fc879c8fad369eba23c8b415b803fb7f3263486db49bca3ed5a5c4e9c882a0762fe9503dc";

// server
const backend_url = process.env.NEXT_PUBLIC_DB_BASE_URL;
const auth_token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImEubW91c3NhQGNmb2NvbnN1bHRpbmcuY3BhIiwicGFzc3dvcmQiOiJDZjBAMjAyMiIsImlhdCI6MTY3OTI5NDUyNH0.3GSXbDY9i01jZoStIQyeEN0ZzKhyT_ThKKjC0ItLu3c";
export { api_url, auth_token, base_url, backend_url, qatar_currency };

export {
  CBQ_ACCESS_KEY,
  CBQ_PROFILE_ID,
  CBQ_MERCHANT_ID,
  CBQ_TRANSACTION_TYPE,
  CBQ_CURRENCY_CODE,
  CBQ_TRANSACTION_URL,
  CBQ_SECRET_KEY,
};

export {
  IS_CERT_AUTH_ENABLED,
  BASEURL,
  API_VERSION,
  USERNAME,
  PASSWORD,
  MERCHANTID,
  AMEX_TOKEN,
  DB_BASE_URL,
  AMEX_REDIRECT_URL,
};
