import crypto from "crypto";
import "dotenv/config";

const keyHex = process.env.IMGPROXY_KEY;
const saltHex = process.env.IMGPROXY_SALT;

const key = Buffer.from(keyHex, "hex");
const salt = Buffer.from(saltHex, "hex");

const imageUrl =
  "https://mars.nasa.gov/system/downloadable_items/39099_Mars-MRO-orbiter-fresh-crater-sirenum-fossae.jpg"; // sample image from nasa
const resize = "rs:fit:600:400";
const format = "avif";

function encodeUrlSafeBase64(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateSignedUrl(imageUrl, transformation, format) {
  const urlPath = `/${transformation}/plain/${imageUrl}@${format}`;
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(salt);
  hmac.update(urlPath);
  const signature = encodeUrlSafeBase64(hmac.digest());
  return `http://localhost:8080/${signature}${urlPath}`;
}

const signedUrl = generateSignedUrl(imageUrl, resize, format);
console.log("🔐 Signed imgproxy URL:\n", signedUrl);
