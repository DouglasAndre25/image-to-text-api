require("dotenv/config");

const path = require("path");
const express = require("express");
const cors = require("cors");
const { createWorker } = require("tesseract.js");
const multer = require("multer");
const crypto = require("crypto");
const webScrappingTranslate = require("./webScrappingTranslate");

const imagePath = path.resolve(__dirname, "tmp", "uploads");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/translate", express.static(imagePath));

const upload = multer({
  storage: multer.diskStorage({
    destination: imagePath,
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);

        return callback(
          null,
          res.toString("hex") + path.extname(file.originalname)
        );
      });
    },
  }),
});

app.post("/translate", upload.single("file"), async (req, res) => {
  const { body, file } = req;

  console.log(file);

  const worker = createWorker({
    logger: (m) => console.log(m),
  });

  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  let translateImagePath = body.imageUrl ?? `${imagePath}\\${file.filename}`;

  const {
    data: { text: originalText },
  } = await worker.recognize(translateImagePath);
  await worker.terminate();

  const translate = await webScrappingTranslate(originalText);

  return res.send({
    originalText,
    translate
  });
});

app.listen(process.env.PORT, () => {
  console.log("Servidor em execução...");
});
