import meal from "../../model/Meal.model.js";

const MealCreate = async (messId, mealData) => {
  return await meal.create({
    messId,
    ...mealData,
  });
};

const MealGetById = async (mealId) => {
  return await meal
    .findById(mealId)
    .populate("messId", "name area")
    .sort({ createdAt: -1 });
};

const MealGetAll = async (filters = {}) => {
  return await meal
    .find(filters)
    .populate("messId", "name area address")
    .sort({ createdAt: -1 });
};

const MealGetByMessId = async (messId) => {
  return await meal
    .find({ messId })
    .populate("messId", "name area")
    .sort({ createdAt: -1 });
};

const MealUpdateById = async (mealId, updateData) => {
  return await meal.findByIdAndUpdate(mealId, updateData, {
    new: true,
    runValidators: true,
  });
};

const MealDeleteById = async (mealId) => {
  return await meal.findByIdAndDelete(mealId);
};

const MealDeleteByMessId = async (messId) => {
  return await meal.deleteMany({ messId });
};

const MealDeleteAll = async () => {
  return await meal.deleteMany({});
};

const MealCount = async (filters = {}) => {
  return await meal.countDocuments(filters);
};

const MealCountByMessId = async (messId) => {
  return await meal.countDocuments({ messId });
};

const MealCountAll = async () => {
  return await meal.countDocuments({});
};

const MealExists = async (mealId) => {
  return await meal.exists({ _id: mealId });
};

const MealExistsByMessId = async (messId) => {
  return await meal.exists({ messId });
};

const MealExistsAll = async () => {
  return await meal.exists({});
};

const Meal = {
  MealCreate,
  MealGetById,
  MealGetAll,
  MealGetByMessId,
  MealUpdateById,
  MealDeleteById,
  MealDeleteByMessId,
  MealDeleteAll,
  MealCount,
  MealCountByMessId,
  MealCountAll,
  MealExists,
  MealExistsByMessId,
  MealExistsAll,
};

export default Meal;
