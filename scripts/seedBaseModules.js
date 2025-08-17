require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types"); // install this with: npm i mime-types

const createSlug = require("../utils/slugifyHelper");
const User = require("../models/user");
const Module = require("../models/module");
const baseModules = require("../data/baseModules");

const MODULE_IMAGE_SOURCE_DIR = path.join(__dirname, "../data/moduleImages");
const MODULE_IMAGE_UPLOAD_DIR = path.join(__dirname, "../uploads/modules");

async function seedBaseModules() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let baseUser = await User.findOne({ username: "base" });

    if (!baseUser) {
      baseUser = await User.create({
        username: "base",
        role: "system",
        password: "__system__",
      });
      console.log("👤 Created base user");
    }

    for (const mod of baseModules) {
      const baseSlug = createSlug(mod.name);
      let slug = baseSlug;
      let counter = 2;

      while (await Module.exists({ owner: baseUser._id, slug })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const existing = await Module.findOne({ owner: baseUser._id, slug });
      if (existing) {
        console.log(`⏩ Skipping existing module: ${slug}`);
        continue;
      }

      // 👀 Try to attach image from data/moduleImages/
      const imageFilename = mod.imageFilename; // 🌟 use the one from baseModules.js
      let imageData;

      if (imageFilename) {
        const sourcePath = path.join(MODULE_IMAGE_SOURCE_DIR, imageFilename);

        if (fs.existsSync(sourcePath)) {
          const mimeType =
            mime.lookup(sourcePath) || "application/octet-stream";
          const size = fs.statSync(sourcePath).size;
          const destPath = path.join(MODULE_IMAGE_UPLOAD_DIR, imageFilename);

          fs.copyFileSync(sourcePath, destPath);

          imageData = {
            url: `/static/modules/${imageFilename}`, // served by app.use('/static', ...)
            key: imageFilename,
            mimeType,
            size,
          };

          console.log(`🖼️  Attached image: ${imageFilename}`);
        } else {
          console.warn(`⚠️ Image not found: ${sourcePath}`);
        }
      } else {
        console.log(`ℹ️ No image for: ${mod.name}`);
      }

      await Module.create({
        owner: baseUser._id,
        name: mod.name,
        slug,
        description: mod.description,
        tags: mod.tags,
        image: imageData,
      });

      console.log(`✅ Seeded module: ${slug}`);
    }

    console.log("✨ All base modules processed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedBaseModules();
