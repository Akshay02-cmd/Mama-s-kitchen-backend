import meal from "../../model/Meal.model.js";
import mongoose from "mongoose";

interface IMeal {
  messId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  createdAt?: Date;
}

type MealDocument = mongoose.HydratedDocument<any, {},IMeal,{}, string> & IMeal & {
  _id: mongoose.Types.ObjectId;
  _v: number;
  createdAt: Date;
  updatedAt: Date;
  messId: mongoose.Types.ObjectId;
};

type objectId = mongoose.Types.ObjectId;


class Meal {
  async MealCreate( messId: string, mealData: IMeal): Promise<MealDocument> {
    return await meal.create({
      messId,
      ...mealData,
    });
  }

  async MealGetById(mealId: string): Promise<MealDocument | null> {
    return await meal
      .findById(mealId)
      .populate("messId", "name area")
      .sort({ createdAt: -1 });
  }

  async MealGetAll(filters = {}): Promise<MealDocument[]> {
    return await meal
      .find(filters)
      .populate("messId", "name area address")
      .sort({ createdAt: -1 });
  }

  async MealGetByMessId(messId: string): Promise<MealDocument[]> {
    return await meal
      .find({ messId })
      .populate("messId", "name area")
      .sort({ createdAt: -1 });
  }

  async MealUpdateById(mealId: string, updateData: IMeal): Promise<MealDocument | null> {
    return await meal.findByIdAndUpdate(mealId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async MealDeleteById(mealId: string): Promise<MealDocument | null> {
    return await meal.findByIdAndDelete(mealId);
  }

  async MealDeleteByMessId(messId: string): Promise<mongoose.DeleteResult> {
    return await meal.deleteMany({ messId });
  }

  async MealDeleteAll(): Promise<mongoose.DeleteResult> {
    return await meal.deleteMany({});
  }

  async MealCount(filters = {}): Promise<number> {
    return await meal.countDocuments(filters);
  }

  async MealCountByMessId(messId: string): Promise<number> {
    return await meal.countDocuments({ messId });
  }

  async MealCountAll(): Promise<number> {
    return await meal.countDocuments({});
  }

  async MealExists(mealId: string): Promise<{_id: mongoose.Types.ObjectId} | null> {
    return await meal.exists({ _id: mealId });
  }

  async MealExistsByMessId(messId: string): Promise<{_id: mongoose.Types.ObjectId} | null> {
    return await meal.exists({ messId });
  }

  async MealExistsAll()  {
    return await meal.exists({});
  }
}

export default new Meal;
