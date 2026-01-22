import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.send("Submit a review endpoint is under construction");
});

router.get("/", (req, res) => {
  res.send("Get all reviews endpoint is under construction");
});

export default router;
