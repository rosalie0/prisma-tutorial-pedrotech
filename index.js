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
  try {
    const newUser = await prisma.user.create({
      data: { firstName, lastName, age },
    });
    res.json(newUser);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

// PUT user (only their age)
app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newAge = req.body.age;
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { age: newAge },
  });
  res.json(user);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.json(user);
});

// GET all houses
app.get("/house", async (req, res) => {
  const allHouses = await prisma.house.findMany({
    // returns the owner and builtBy user objects
    include: {
      owner: true,
      builtBy: true,
    },
  });
  res.json(allHouses);
});

// Get houses with a wifipassword and the owner is 18+
app.get("/house/withFilters", async (req, res) => {
  const filteredHouses = await prisma.house.findMany({
    //Get me the houses where...
    where: {
      wifiPassword: { not: null }, // there is a wifiPassword
      owner: {
        age: { gte: 18 }, // the owner's age is greater than or equal to 18
      },
    },
    // Sort it A-Z of the owner's name.
    orderBy: [{ owner: { firstName: "desc" } }],
    // Include the owner and builtBy as objects.
    include: {
      owner: true,
      builtBy: true,
    },
  });
  console.log(filteredHouses);
  res.json(filteredHouses);
});
// Get house of id
app.get("/house/:id", async (req, res) => {
  const { id } = req.params;
  const allHouses = await prisma.house.findUnique(
    {
      where: { id },
    },
    {
      // returns the owner and builtBy user objects
      include: {
        owner: true,
        builtBy: true,
      },
    }
  );
  res.json(allHouses);
});

// POST house
app.post("/house", async (req, res) => {
  const { address, wifiPassword, ownerId, builtById } = req.body;
  console.log(address, wifiPassword, ownerId, builtById);
  try {
    const newHouse = await prisma.house.create({
      data: { address, wifiPassword, ownerId, builtById },
    });
    res.json(newHouse);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

app.listen(3001, () => console.log("express server running on port 3001..."));
