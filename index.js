import { load } from "cheerio";
import axios from "axios";
import express from "express";

const url = "https://kbbi.kemdikbud.go.id/entri/";
const PORT = 5000;
const app = express();

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "API Online", author: "FForFachriza", dateNow: new Date().toLocaleDateString() });
  } catch (error) {
    res.status(404).json({ message: "Error", error: error.message });
  }
});

app.get("/v1/api/kbbi/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(url + id);
    // console.log(data);
    const $ = load(data);
    const getData = [];
    const listedArti = [];
    // Scrape
    $("body div.container.body-content ").each((i, el) => {
      const kata = $(el).find("h2").text();
      const arti = $(el).find("ul.adjusted-par li").text().slice(9, 1000);
      const tesasaurus = $(el).find(" p a").attr("href");
      const listarti = $(el)
        .find("ol li")
        .each((i, el) => {
          const list = $(el).text().slice(9, 1000);
          listedArti.push(list);
          return listedArti;
        });

      //   arti ? getData.push({ kata, arti, tesasaurus }) : getData.push({ kata, arti: listedArti, tesasaurus });

      if (arti) {
        getData.push({ kata, arti, tesasaurus });
        return res.status(200).json({ message: "Success", data: getData });
      } else {
        if (arti.length === 0) {
          getData.push({ message: "Tidak ditemukan" });
          return res.status(404).json({ message: "Error", data: getData });
        } else {
          getData.push({ kata, arti: listedArti, tesasaurus });
          return res.status(200).json({ message: "Success", data: getData });
        }
      }

    //   return getData;
    });
    // res.status(200).json({ message: "Success", data: getData });
  } catch (error) {
    res.status(404).json({ message: "Error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
