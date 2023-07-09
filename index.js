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

// PUT user (only their age)
app.put("/:id", async (req, res) => {
  //
  const { id } = req.params;
  const newAge = req.body.age;
  // Update the user with the id of parseInt id, update their age.
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { age: newAge },
  });
  res.json(user);
});

app.delete("/:id", async (req, res) => {
  //
  const { id } = req.params;
  // Update the user with the id of parseInt id, update their age.
  const user = await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.json(user);
});

app.listen(3001, () => console.log("express server running on port 3001..."));
