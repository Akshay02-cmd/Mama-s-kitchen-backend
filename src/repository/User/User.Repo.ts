import User from "../../model/user.model.js";

class user {
  find(filters: any = {}) {
    return User.find(filters);
  }

  findById(userId: any) {
    return User.findById(userId);
  }

  findOne(filters: any = {}) {
    return User.findOne(filters);
  }

  async create(userData: any) {
    return User.create(userData);
  }

  countDocuments(filters: any = {}) {
    return User.countDocuments(filters);
  }

  async checkExistUser(email: any) {
    return User.findOne({ email });
  }

  async createUser(userData: any) {
    return User.create(userData);
  }

  async UserAll() {
    return User.find({}).select("-password");
  }

  async UserCount() {
    return User.countDocuments();
  }

  async UserById(userId: any) {
    return User.findById(userId).select("+password");
  }

  async UserByEmail(email: any) {
    return User.findOne({ email }).select("+password");
  }
}

export default new user;
