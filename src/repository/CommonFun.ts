import mongoose from "mongoose";
type mongooseModel = mongoose.Model<any, {}, any>;

interface IUserData{
  role: "CUSTOMER" | "OWNER";
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
 }

const find: (model: mongooseModel, filters: any) => Promise<{}> = (model, filters) => {
    return model.find(filters);
};

const findById: (model: mongooseModel, id: mongoose.Types.ObjectId) => Promise<{}> = (model, id) => {
    return model.findById(id);
}

const findOne: (model: mongooseModel, filters: any) => Promise<{}> = (model, filters) => {
    return model.findOne(filters);
}

const create: (model: mongooseModel, data: any) => Promise<{}> = (model, data) => {
    return model.create(data);
}
