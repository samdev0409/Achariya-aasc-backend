import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODELS_DIR = path.resolve(__dirname, "..", "models");
const CONTROLLERS_DIR = path.resolve(__dirname, "..", "controllers");

const collections = [
  "home__recruitersdata",
  "home__testimonialdata",
  "home__welcomedata",
  "iqac__nirfdata",
  "placements__placementrecords",
  "placements__trainingandplacementsdata",
  "events__eventsdata",
  "events__upcommingeventspreviewdata",
  "home__achievementsstatsdata",
  "home__admissionsdata",
  "home__allhomedata",
  "home__announcementsdata",
  "home__carouseldata",
  "home__circularpreviewdata",
  "home__missionvisiondata",
  "home__newstickerdata",
  "home__ourcampusdata",
  "home__ourleads",
  "home__ourschoolscollegesdata",
  "about__chiefmentordata",
  "about__governingbodycouncildata",
  "about__ourteamdata",
  "about__pressreleasesdata",
  "about__principaldata",
  "about__profileofcollegedata",
  "academics__academiccalendardata",
  "academics__departmentsdata",
  "academics__pgprogrammsdetails",
  "academics__prospectusdata",
  "academics__ugprogramsdatadetails",
  "academics__valueaddedcoursesdata",
  "campus-life__seeddata",
  "committees__committiesdata",
  "contact__contactdata",
];

const createModel = (name) => {
  const content = `import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  data: {
    type: Object,
    required: true,
    default: {}
  }
}, { timestamps: true, strict: false });

export default mongoose.model('${name}', schema, '${name}');
`;
  fs.writeFileSync(path.join(MODELS_DIR, `${name}.js`), content);
  console.log(`✅ Created Model: ${name}.js`);
};

const createController = (name) => {
  const content = `import Model from '../models/${name}.js';

export const getAll = async (req, res) => {
  try {
    const data = await Model.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Model.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload.data) {
       payload = { data: payload };
    }
    const newData = new Model(payload);
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await Model.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Model.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
`;
  fs.writeFileSync(path.join(CONTROLLERS_DIR, `${name}Controller.js`), content);
  console.log(`✅ Created Controller: ${name}Controller.js`);
};

const run = () => {
  if (!fs.existsSync(MODELS_DIR)) fs.mkdirSync(MODELS_DIR, { recursive: true });
  if (!fs.existsSync(CONTROLLERS_DIR))
    fs.mkdirSync(CONTROLLERS_DIR, { recursive: true });

  // 1. Create Files
  collections.forEach((name) => {
    createModel(name);
    createController(name);
  });

  // 2. Delete Mismatches
  const modelFiles = fs.readdirSync(MODELS_DIR);
  modelFiles.forEach((file) => {
    if (file === "User.js") return; // Keep User model
    const name = file.replace(".js", "");
    if (!collections.includes(name)) {
      fs.unlinkSync(path.join(MODELS_DIR, file));
      console.log(`🗑️  Deleted Mismatch Model: ${file}`);
    }
  });

  const controllerFiles = fs.readdirSync(CONTROLLERS_DIR);
  controllerFiles.forEach((file) => {
    if (file === "authController.js" || file === "getAllController.js") return; // Keep special controllers
    const name = file.replace("Controller.js", "");
    if (!collections.includes(name)) {
      fs.unlinkSync(path.join(CONTROLLERS_DIR, file));
      console.log(`🗑️  Deleted Mismatch Controller: ${file}`);
    }
  });
};

run();
