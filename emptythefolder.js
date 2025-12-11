import fs from "fs";
import path from "path";

const assetsPath = path.join(process.cwd(), "assets");

function deleteFilesRecursively(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.log("Path does not exist:", folderPath);
    return;
  }

  const items = fs.readdirSync(folderPath);

  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Recursively process subfolder, but do NOT delete the folder
      deleteFilesRecursively(fullPath);
    } else {
      // Delete only files
      fs.unlinkSync(fullPath);
      console.log("Deleted file:", fullPath);
    }
  }
}

deleteFilesRecursively(assetsPath);
console.log("All files inside assets and its subfolders removed successfully!");
