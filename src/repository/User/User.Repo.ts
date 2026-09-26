import User from "../../model/user.model.js";

export type UserRole = "CUSTOMER" | "OWNER";

export interface IUser {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

class UserRepo {
  async checkExistUser(email: string) {
    return User.findOne({ email });
  }

  async createUser(userData: IUser) {
    return User.create(userData);
  }

  async UserAll() {
    return User.find({}).select("-password");
  }

  async UserCount() {
    return User.countDocuments();
  }

  async UserById(userId: string) {
    return User.findById(userId).select("+password");
  }

  async UserByEmail(email: string) {
    return User.findOne({ email }).select("+password");
  }
}

export default new UserRepo();
