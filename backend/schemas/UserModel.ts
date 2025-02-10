import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  nome: string;
  email: string;
  senha: string;
  profissao: string;
  localizacao: {
    type: string;
    coordinates: [number, number];
  };
  interesses: string[];
}

const UserSchema = new Schema<IUser>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  profissao: { type: String, required: true },
  localizacao: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  interesses: { type: [String], required: true },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;