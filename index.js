const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// body parse
app.use(express.json());

// GET all users
app.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

// POST user
app.post("/", async (req, res) => {
  const { firstName, lastName, age } = req.body;
  console.log(firstName, lastName, age);
  const newUser = await prisma.user.create({
    data: { firstName, lastName, age },
  });
  res.json(newUser);
});

app.listen(3001, () => console.log("express server running on port 3001..."));
