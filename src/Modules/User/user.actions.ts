import { Jwt } from "hono/utils/jwt";
import { getHash, getRandom } from "@auth/auth.actions";
import userModel, { IUser, IUserModel } from "./user.model";

export const GetAllUsers = () => userModel.find();
export const GetById = (id: string) => userModel.findById(id);
export const GetByEmail = (email: string) => userModel.findOne({ email });
export const DeleteById = (id: string) => userModel.findByIdAndDelete(id);
export const UpdateById = (id: string, values: Record<string, any>) =>
  userModel.findByIdAndUpdate(id, values);

export const GetByIdWithAuth = (id: string) =>
  userModel
    .findById(id)
    .select("+authentication.salt +authentication.password");

export const GetByEmailWithAuth = (email: string) =>
  userModel
    .findOne({ email })
    .select("+authentication.salt +authentication.password");

export const create = async (values: Record<string, any>) => {
  const user = new userModel(values);

  if (!user || !user.authentication) return false;

  const salt = getRandom();
  const hash = getHash(salt, values.password);

  user.created = new Date();
  user.authentication.password = hash;
  user.authentication.salt = salt;

  return getSafeProps((await user.save()) as IUser);
};

export const getSafeProps = (user: IUser) => {
  const { authentication: _, ...userProps } = user;
  return userProps as IUser;
};

export const GetJWT = (user: IUserModel) => {
  const secret = getRandom();
  user.authentication.sessionToken = secret;
  user.save();

  return Jwt.sign({ id: user._id }, secret);
};
