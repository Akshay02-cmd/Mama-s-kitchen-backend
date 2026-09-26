import joi from "joi";

const envSchema = joi.object({
  NODE_ENV: joi.string().valid("development", "production", "test").default("development"),
  PORT: joi.number().default(3000),
  MONGODB_URL: joi.string().required().description("Mongo DB url"),
  JWT_SECRET: joi.string().required().description("JWT secret key"),
  JWT_ACCESS_EXPIRATION_MINUTES: joi.number().default(10080).description("minutes after which access tokens expire"), // Default: 7 days (10080 minutes)
  JWT_REFRESH_EXPIRATION_DAYS: joi.number().default(30).description("days after which refresh tokens expire"),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi.number().default(10).description("minutes after which reset password token expires"),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi.number().default(10).description("minutes after which verify email token expires"),
  CLOUDINARY_CLOUD_NAME: joi.string().allow(""),
  CLOUDINARY_API_KEY: joi.string().allow(""),
  CLOUDINARY_API_SECRET: joi.string().allow(""),
}).unknown();

export default envSchema;