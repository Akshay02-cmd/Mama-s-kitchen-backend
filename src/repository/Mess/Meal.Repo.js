import meal from "../../model/Meal.model.js";

class Meal {
  async MealCreate(messId, mealData) {
    return await meal.create({
      messId,
      ...mealData,
    });
  }

  async MealGetById(mealId) {
    return await meal
      .findById(mealId)
      .populate("messId", "name area")
      .sort({ createdAt: -1 });
  }

  async MealGetAll(filters = {}) {
    return await meal
      .find(filters)
      .populate("messId", "name area address")
      .sort({ createdAt: -1 });
  }

  async MealGetByMessId(messId) {
    return await meal
      .find({ messId })
      .populate("messId", "name area")
      .sort({ createdAt: -1 });
  }

  async MealUpdateById(mealId, updateData) {
    return await meal.findByIdAndUpdate(mealId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async MealDeleteById(mealId) {
    return await meal.findByIdAndDelete(mealId);
  }

  async MealDeleteByMessId(messId) {
    return await meal.deleteMany({ messId });
  }

  async MealDeleteAll() {
    return await meal.deleteMany({});
  }

  async MealCount(filters = {}) {
    return await meal.countDocuments(filters);
  }

  async MealCountByMessId(messId) {
    return await meal.countDocuments({ messId });
  }

  async MealCountAll() {
    return await meal.countDocuments({});
  }

  async MealExists(mealId) {
    return await meal.exists({ _id: mealId });
  }

  async MealExistsByMessId(messId) {
    return await meal.exists({ messId });
  }

  async MealExistsAll() {
    return await meal.exists({});
  }
}

export default new Meal;
