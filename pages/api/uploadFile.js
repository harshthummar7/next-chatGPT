import formidable from "formidable";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const keyFilePath = path.join(process.cwd(), "credential.json");

export default async function upload(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Failed to parse form data." });
      return;
    }

    const { file } = files;
    // const { session } = fields;

    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,

      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    try {
      const fileSize = fs.statSync(file.filepath).size.toString();
      console.log(fileSize);
      let uploadedBytes = 0;

      const data = await drive.files.create({
        requestBody: {
          name: file.originalFilename,
          parents: ["1LlaefbvZpW0qq-VEYk8w3hvoMmis-NDo"],
        },
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(`${file.filepath}`).on("data", (chunk) => {
            uploadedBytes += chunk.length;
            const progress = Math.round((uploadedBytes / fileSize) * 100);

            console.log(progress);
          }),
        },
      });

      const dataUrl = await getFileContent(data.data.id);

      res.status(200).json({ fileDetail: data, dataUrl });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });
}

async function getFileContent(fileId) {
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const drive = google.drive({ version: "v3", auth });

  try {
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "arraybuffer" }
    );

    const data = Buffer.from(response.data, "binary").toString("base64");
    const mimeType = response.headers["content-type"];
    console.log(mimeType);
    const dataUrl = `data:${mimeType};base64,${data}`;

    return dataUrl;
  } catch (error) {
    console.error("Error retrieving file content:", error);
    throw error;
  }
}
