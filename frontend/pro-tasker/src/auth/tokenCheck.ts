import { jwtDecode,type  JwtPayload } from "jwt-decode";



export default function isTokenExpired(token: string) {
  const decoded = jwtDecode<JwtPayload>(token);

  console.log("decoded token:", decoded);

  const expCheck = decoded.exp ? decoded.exp * 1000 < Date.now() : true;

  console.log({
    exp: decoded.exp,
    now: Date.now(),
    expired: expCheck,
  });

  return expCheck;

}