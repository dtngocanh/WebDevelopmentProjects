import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const APIKey = "3a341bd8bb3d5b1caafb4eddbd56159e";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/search", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${APIKey}`
    );

    const temperature = Math.round(response.data.main.temp - 273.15);
    const humidity = response.data.main.humidity;
    const description = response.data.weather[0].description;
    const urlImg =
      "images/" + response.data.weather[0].main.toLowerCase() + ".png";
    const wind = response.data.wind.speed;

    console.log(response);
    console.log(urlImg);

    res.render("index.ejs", {
      temperature: temperature,
      humidity: humidity,
      description: description,
      wind: wind,
      urlImg: urlImg,
    });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs");
  }
});
app.listen(port, () => {
  console.log(`Server is runnning on port ${port}`);
});
