import { IUser } from './path/to/your/UserModel'; // Ajuste o caminho conforme necessário

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Torna a propriedade user opcional
    }
  }
}