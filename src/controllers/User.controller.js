const getallUsers = (req, res) => {
  // Logic to get all users
  res.status(200).json({ message: "Get all users" });
};

const getallCustomers = (req, res) => {
  // Logic to get all customers
  res.status(200).json({ message: "Get all customers" });
};

const getallOwners = (req, res) => {
  // Logic to get all owners
  res.status(200).json({ message: "Get all owners" });
};
export { getallUsers, getallCustomers, getallOwners };