import express from "express";

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Orders endpoint is under construction");
});

export default router;