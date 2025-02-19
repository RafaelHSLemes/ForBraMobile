import mongoose, { Schema, Document } from 'mongoose';

interface IAddress {
  street?: string;      // Para endereços dos EUA
  city?: string;
  state?: string;
  zipcode?: string;

  logradouro?: string;  // Para endereços do Brasil
  cidade?: string;
  estado?: string;
  CEP?: string;

  country: string;      // Comum para ambos
}

interface IUser extends Document {
  nome: string;
  email: string;
  senha: string;
  profissao: string;
  localizacao: {
    type: 'Point';
    coordinates: [number, number];
  };
  endereco: IAddress;
  interesses: string[];
}

const AddressSchema = new Schema<IAddress>({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipcode: { type: String },

  logradouro: { type: String },
  cidade: { type: String },
  estado: { type: String },
  CEP: { type: String },

  country: { type: String, required: true },
});

const UserSchema = new Schema<IUser>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  profissao: { type: String, required: true },
  localizacao: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  endereco: { type: AddressSchema, required: true },
  interesses: { type: [String], required: true },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
export type { IUser };