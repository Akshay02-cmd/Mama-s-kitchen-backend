import Joi from "joi";

const objectIdSchema = Joi.string().length(24).hex().required();
const optionalObjectId = Joi.string().length(24).hex();

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        mealId: objectIdSchema,
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        selectedExtras: Joi.array()
          .items(
            Joi.object({
              extraId: optionalObjectId,
              name: Joi.string().required(),
              price: Joi.number().min(0).required(),
            }),
          )
          .default([]),
      }),
    )
    .min(1)
    .required(),
  deliveryAddress: Joi.string().required(),
  deliveryPhone: Joi.string().required(),
  status: Joi.string()
    .valid("PLACED", "PREPARING", "DELIVERED", "CANCELLED")
    .default("PLACED"),
  paymentMethod: Joi.string()
    .valid("CREDIT_CARD", "DEBIT_CARD", "UPI", "COD")
    .required(),
  paymentStatus: Joi.string()
    .valid("PENDING", "COMPLETED", "FAILED")
    .default("PENDING"),
  paymentId: Joi.string(),
  notes: Joi.string().max(500),
  deliverytime: Joi.date(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PLACED", "PREPARING", "DELIVERED", "CANCELLED")
    .required(),
});
