const multer = require("multer");

let upload;

try {
  const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = file.originalname.split(".").pop();
      cb(
        null,
        `${file.originalname
          .split(".")[0]
          .replace(/\s/g, "")}-${uniqueSuffix}.${fileExtension}`
      );
    },
  });

  upload = multer({ storage: internalStorage });
} catch (error) {
  console.error("Errore nella configurazione di multer:", error);
}

module.exports = upload;
