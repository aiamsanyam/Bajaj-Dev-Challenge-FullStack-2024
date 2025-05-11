const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { isPrime, decodeBase64File } = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "frontend")));

const FULL_NAME = "john_doe";
const DOB = "17091999";
const USER_ID = `${FULL_NAME}_${DOB}`;
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

app.get("/bfhl", (req, res) => {
  return res.status(200).json({
    operation_code: 1,
  });
});

app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    const numbers = [];
    const alphabets = [];
    let highestLower = null;
    let foundPrime = false;

    if (data && Array.isArray(data)) {
      data.forEach((item) => {
        if (!isNaN(item)) {
          numbers.push(item);
          if (isPrime(parseInt(item))) foundPrime = true;
        } else if (
          typeof item === "string" &&
          item.length === 1 &&
          /^[a-zA-Z]$/.test(item)
        ) {
          alphabets.push(item);
          if (/[a-z]/.test(item)) {
            if (!highestLower || item > highestLower) {
              highestLower = item;
            }
          }
        }
      });
    }

    let fileDetails = {
      file_valid: false,
    };

    if (file_b64) {
      const { valid, mimeType, sizeInKB } = decodeBase64File(file_b64);
      fileDetails = {
        file_valid: valid,
        file_mime_type: mimeType,
        file_size_kb: sizeInKB,
      };
    }

    return res.status(200).json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLower ? [highestLower] : [],
      is_prime_found: foundPrime,
      ...fileDetails,
    });
  } catch (error) {
    return res.status(400).json({ is_success: false, error: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
