export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.statu(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }
    next(); 
  };
};

export default validate;