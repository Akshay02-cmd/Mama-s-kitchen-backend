const notfoundMiddleware = (req:any, res:any, next:any) => {
  res.status(404).send("Endpoint not found");
};

export default notfoundMiddleware;