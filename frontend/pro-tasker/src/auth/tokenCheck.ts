import { jwtDecode, type JwtPayload } from "jwt-decode";

export default function isTokenExpired(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp ? decoded.exp * 1000 <= Date.now() : true;
  } catch {
    return true;
  }
}
