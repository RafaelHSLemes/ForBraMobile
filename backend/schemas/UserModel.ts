import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface que define os tipos dos campos do documento Usuário
interface IUser extends Document {
  nome: string;
  email: string;
  senha: string;
  localizacao: {
    latitude: number;
    longitude: number;
  };
  profissao: string;
  interesses: string[];
  dataDeNascimento?: Date; // Campo opcional
  criadoEm: Date;
  atualizadoEm: Date;
}

// Esquema do Mongoose para o Usuário
const UserSchema: Schema<IUser> = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true, // Remove espaços desnecessários
    },
    email: {
      type: String,
      required: true,
      unique: true, // Garante que o email seja único
      trim: true,
      lowercase: true, // Converte o email para minúsculas
    },
    senha: {
      type: String,
      required: true,
    },
    localizacao: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    profissao: {
      type: String,
      required: true,
    },
    interesses: {
      type: [String], // Array de strings para múltiplos interesses
      default: [], // Array vazio como padrão
    },
    dataDeNascimento: {
      type: Date,
      required: false,
    },
    criadoEm: {
      type: Date,
      default: Date.now, // Define a data de criação automaticamente
    },
    atualizadoEm: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adiciona automaticamente 'createdAt' e 'updatedAt'
  }
);

// Middleware para atualizar o campo 'atualizadoEm' antes de salvar
UserSchema.pre<IUser>('save', function (next) {
  this.atualizadoEm = new Date();
  next();
});

// Exporta o modelo do Usuário
const UserModel: Model<IUser> = mongoose.model<IUser>('Usuario', UserSchema);

export default UserModel;