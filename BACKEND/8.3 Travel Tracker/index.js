import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "180625",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const rs = await db.query("SELECT country_code FROM visited_country");
  console.log(rs);
  let countries = [];
  rs.rows.forEach((row) => {
    countries.push(row.country_code);
  });
  console.log(countries);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
  });
});

app.post("/add", async (req, res) => {
  const rs = await db.query(
    "SELECT country_code FROM countries WHERE country_name = $1",
    [req.body.country]
  );
  console.log(rs);
  if (rs.rows.length !== 0) {
    const country_code = rs.rows[0].country_code;
    await db.query("INSERT INTO visited_country (country_code) VALUES ($1)", [
      country_code,
    ]);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
