import { TokenPair } from "../../utils/auth.util";

export default interface IAuthService {
  login(email: string, password: string): Promise<TokenPair>;
  refresh(refreshToken: string): Promise<TokenPair>;
  logout(userId: string): Promise<void>;
}