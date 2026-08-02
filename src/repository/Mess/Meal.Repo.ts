import meal from "../../model/Meal.model.js";
import mongoose from "mongoose";

interface IMeal {
  name: string;
  description: string;
  price: number;
  image?: string;
  createdAt?: Date;
}

type MealCreateInput = IMeal & {
  messId?: never;
};

type MealDocument = mongoose.HydratedDocument<any, {}, IMeal, {}, string> & IMeal & {
  _id: mongoose.Types.ObjectId;
  _v: number;
  createdAt: Date;
  updatedAt: Date;
  messId: mongoose.Types.ObjectId;
};

type objectId = mongoose.Types.ObjectId;


class Meal {
  find(filters: any = {}) {
    return meal.find(filters);
  }

  findById(mealId: any) {
    return meal.findById(mealId);
  }

  async create(data: any) {
    return meal.create(data);
  }

  findByIdAndUpdate(mealId: any, updateData: any, options: any = {}) {
    return meal.findByIdAndUpdate(mealId, updateData, options);
  }

  findByIdAndDelete(mealId: any) {
    return meal.findByIdAndDelete(mealId);
  }

  deleteMany(filters: any = {}) {
    return meal.deleteMany(filters);
  }

  countDocuments(filters: any = {}) {
    return meal.countDocuments(filters);
  }

  exists(filters: any = {}) {
    return meal.exists(filters);
  }

  async MealCreate(messId: any, mealData: MealCreateInput): Promise<MealDocument> {
    return await meal.create({
      ...mealData,
      messId,
    });
  }

  async MealGetById(mealId: any): Promise<MealDocument | null> {
    return await meal
      .findById(mealId)
      .populate("messId", "name area")
      .sort({ createdAt: -1 });
  }

  async MealGetAll(filters: any = {}): Promise<MealDocument[]> {
    return await meal
      .find(filters)
      .populate("messId", "name area address")
      .sort({ createdAt: -1 });
  }

  async MealGetByMessId(messId: any): Promise<MealDocument[]> {
    return await meal
      .find({ messId })
      .populate("messId", "name area")
      .sort({ createdAt: -1 });
  }

  async MealUpdateById(mealId: any, updateData: IMeal): Promise<MealDocument | null> {
    return await meal.findByIdAndUpdate(mealId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async MealDeleteById(mealId: any): Promise<MealDocument | null> {
    return await meal.findByIdAndDelete(mealId);
  }

  async MealDeleteByMessId(messId: any): Promise<mongoose.DeleteResult> {
    return await meal.deleteMany({ messId });
  }

  async MealDeleteAll(): Promise<mongoose.DeleteResult> {
    return await meal.deleteMany({});
  }

  async MealCount(filters: any = {}): Promise<number> {
    return await meal.countDocuments(filters);
  }

  async MealCountByMessId(messId: any): Promise<number> {
    return await meal.countDocuments({ messId });
  }

  async MealCountAll(): Promise<number> {
    return await meal.countDocuments({});
  }

  async MealExists(mealId: any): Promise<{ _id: mongoose.Types.ObjectId } | null> {
    return await meal.exists({ _id: mealId });
  }

  async MealExistsByMessId(messId: any): Promise<{ _id: mongoose.Types.ObjectId } | null> {
    return await meal.exists({ messId });
  }

  async MealExistsAll() {
    return await meal.exists({});
  }
}

export default new Meal;
