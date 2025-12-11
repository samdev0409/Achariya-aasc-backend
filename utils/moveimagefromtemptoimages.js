import fs from "fs";
import path from "path";

const TEMP_DIR = path.join(process.cwd(), "server/assets/images/chief-mentor/temp");
const FINAL_DIR = path.join(process.cwd(), "server/assets/images/chief-mentor");

export const moveImageToFinal = (fileName) => {
  const tempPath = path.join(TEMP_DIR, fileName);
  const finalPath = path.join(FINAL_DIR, fileName);

  if (fs.existsSync(tempPath)) {
    fs.renameSync(tempPath, finalPath);
    return true;
  }
  return false;
};

export const deleteTempFile = (fileName) => {
  const tempPath = path.join(TEMP_DIR, fileName);
  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }
};
