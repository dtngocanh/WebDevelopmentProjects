import express from "express";
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
app.get("/", (req, res) => {
  let day = "a weekday";
  let advice = "work hard";

  const date = new Date();
  const d = date.getDay();
  if ((d === 0) | (d === 6)) {
    day = "a weekend";
    advice = "have fun time";
  }
  res.render("index.ejs", {
    day: day,
    advice: advice,
  });
});
