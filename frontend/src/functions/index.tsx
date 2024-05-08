import { ACCESS_TOKEN_KEY } from "@/consts";
import cookie from "react-cookies"

export const getToken = (token_key = ACCESS_TOKEN_KEY) => {
    return cookie.load(token_key);
}