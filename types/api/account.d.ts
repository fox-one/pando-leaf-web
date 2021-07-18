declare namespace API {
  export interface AuthResult {
    avatar: string;
    id: string; // uuid
    name: string;
    scope: string;
    token: string;
  }
}
