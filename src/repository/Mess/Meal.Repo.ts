import meal from "../../model/Meal.model.js";
import mongoose from "mongoose";

export interface IMeal {
  messId: mongoose.Types.ObjectId;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  is_Veg: boolean;
  description: string;
  image?: string;
  price: number;
  is_Available: boolean;
  extras: {
    name: string;
    price: number;
    is_Available: boolean;
  }[];
}

class Meal {
  async MealCreate(
    messId: mongoose.Types.ObjectId,
    mealData: Omit<IMeal, "messId">
  ) {
    const { messId: _ignoredMessId, ...mealPayload } = mealData as IMeal;
    return await meal.create({
      messId,
      ...mealPayload,
    });
  }

  async MealGetById(mealId: mongoose.Types.ObjectId) {
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

  async MealGetByMessId(messId: mongoose.Types.ObjectId) {
    return await meal
      .find({ messId })
      .populate("messId", "name area")
      .sort({ createdAt: -1 });
  }

  async MealUpdateById(mealId: mongoose.Types.ObjectId, updateData: Partial<IMeal>) {
    return await meal.findByIdAndUpdate(mealId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async MealDeleteById(mealId: mongoose.Types.ObjectId) {
    return await meal.findByIdAndDelete(mealId);
  }

  async MealDeleteByMessId(messId: mongoose.Types.ObjectId) {
    return await meal.deleteMany({ messId });
  }

  async MealDeleteAll() {
    return await meal.deleteMany({});
  }

  async MealCount(filters = {}) {
    return await meal.countDocuments(filters);
  }

  async MealCountByMessId(messId: mongoose.Types.ObjectId) {
    return await meal.countDocuments({ messId });
  }

  async MealCountAll() {
    return await meal.countDocuments({});
  }

  async MealExists(mealId: mongoose.Types.ObjectId) {
    return await meal.exists({ _id: mealId });
  }

  async MealExistsByMessId(messId: mongoose.Types.ObjectId) {
    return await meal.exists({ messId });
  }

  async MealExistsAll() {
    return await meal.exists({});
  }
}

export default new Meal;
