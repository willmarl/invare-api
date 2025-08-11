const path = require("path");
const fs = require("fs/promises");

const BASE_UPLOADS_DIR = path.join(__dirname, "..", "uploads");

async function save(file, namespace = "modules") {
  const targetDir = path.join(BASE_UPLOADS_DIR, namespace);
  await fs.mkdir(targetDir, { recursive: true });

  const finalPath = path.join(targetDir, file.filename);

  const tempPath = path.join(BASE_UPLOADS_DIR, "temp", file.filename);
  await fs.rename(tempPath, finalPath);

  return {
    key: `${namespace}/${file.filename}`,
    url: `/static/${namespace}/${file.filename}`,
    mimeType: file.mimetype,
    size: file.size,
  };
}

async function remove(key) {
  const filePath = path.join(BASE_UPLOADS_DIR, key);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}

module.exports = {
  save,
  remove,
};
