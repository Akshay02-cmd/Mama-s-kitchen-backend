import mongoose from "mongoose";

interface IMeal {
  messId: mongoose.Types.ObjectId;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  is_Veg: boolean;
  description: string;
  image?: string;
  price: number;
  is_Available: boolean;
  extras?: {
    name: string;
    price: number;
    is_Available: boolean;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface IExtraItem {
  name: string;
  price: number;
  is_Available: boolean;
}

const ExtraItemSchema: mongoose.Schema<IExtraItem> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    is_Available: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const MealSchema: mongoose.Schema<IMeal> = new mongoose.Schema(
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
    image: {
      type: String,
      trim: true,
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
    extras: {
      type: [ExtraItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Meal: mongoose.Model<IMeal> = mongoose.model("Meal", MealSchema);
export default Meal;
