import User from "../../model/user.model.js";

const checkExistUser = async (email) => {
  return User.findOne({ email });
};

const createUser = async (userData) => {
  return User.create(userData);
};

const UserAll = async () => {
  return User.find({}).select("-password");
}

const UserCount = async () => {
  return User.countDocuments();
}

const UserById = async (userId) => {
  return User.findById(userId).select("+password");
};

const UserByEmail = async (email) => {
  return User.findOne({ email }).select("+password");
};

const user = {
  checkExistUser,
  createUser,
  UserAll,
  UserById,
  UserByEmail,
  UserCount,
  
};

export default user;  
