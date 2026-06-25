import User from "../../model/user.model.js";

class user {
  async checkExistUser(email) {
    return User.findOne({ email });
  }

  async createUser(userData) {
    return User.create(userData);
  }

  async UserAll() {
    return User.find({}).select("-password");
  }

  async UserCount() {
    return User.countDocuments();
  }

  async UserById(userId) {
    return User.findById(userId).select("+password");
  }

  async UserByEmail(email) {
    return User.findOne({ email }).select("+password");
  }
}

export default new user;
