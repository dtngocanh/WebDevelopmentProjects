import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "180625",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      res.send("You've registered.");
    } else {
      await db.query("INSERT INTO users (email, password) VALUES ($1,$2);", [
        username,
        password,
      ]);
      res.render("secrets.ejs");
    }
  } catch (error) {
    res.send(error);
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPwd = user.password;
      if (storedPwd === password) {
        res.render("secrets.ejs");
      } else {
        res.send("Your password is wrong.");
      }
    }
  } catch (error) {
    res.send("User not found.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
