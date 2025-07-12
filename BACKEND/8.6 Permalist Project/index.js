import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "180625",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];
let items = [];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items;");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const newItem = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1);", [newItem]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const updatedItemId = parseInt(req.body.updatedItemId);
  const updatedItemTitle = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = $1 WHERE id = $2;", [
    updatedItemTitle,
    updatedItemId,
  ]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const deleteItemId = parseInt(req.body.deleteItemId);
  await db.query("DELETE FROM items WHERE id = $1", [deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
