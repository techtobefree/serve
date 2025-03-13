const fs = require("node:fs");
const path = require("node:path");

const seedsDir = path.join(__dirname, "seeds");

fs.readdir(seedsDir, (err, files) => {
  if (err) {
    console.error("Error reading seeds directory:", err);
    process.exit(1);
  }

  const sqlFiles = files.filter((file) => path.extname(file) === ".sql");

  if (sqlFiles.length === 0) {
    console.log("No SQL files found in the seeds directory.");
    process.exit(0);
  }

  const sqlContents = sqlFiles.map((file) => {
    const filePath = path.join(seedsDir, file);
    return fs.readFileSync(filePath, "utf8");
  });

  const concatenatedSql = sqlContents.join("\n");

  console.log(concatenatedSql);
});
