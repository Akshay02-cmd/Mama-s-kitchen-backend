import mongoose from "mongoose";

const MealSchema = new mongoose.Schema(
  {
    messId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mess",
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    is_Veg: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    is_Available: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Meal = mongoose.model("Meal", MealSchema);
export default Meal;
