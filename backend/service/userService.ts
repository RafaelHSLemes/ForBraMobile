import UserSchema from "../schemas/UserModel"

export const buscarUsuarioPorEmail = async (email: string) => {
    return await UserSchema.findOne({ email });
};