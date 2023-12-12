const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const saltRounds = 10;

// Register
router.post("/register", async (req, res) => {
    try {
      const hashed = await bcrypt.hash(req.body.password, saltRounds);
      const user = await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashed,
        },
      });
      const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' });
      res.send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred during registration.");
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: req.body.username },
      });

      if (!user) {
        return res.status(401).send("User not found");
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(401).send("Password is incorrect");
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' });
      res.send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred during login.");
    }
});

module.exports = router;
