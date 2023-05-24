import { google } from "googleapis";
import formidable from "formidable";
import { getSession } from "next-auth/react";
import fs from "fs";

const CLIENT_ID = process.env.GOOGLE_ID;
const CLIENT_SECRET = process.env.GOOGLE_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export async function uploadFileToDrive(req) {
  console.log("2");
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No access token available.");
  }
  console.log("a");
  const drive = google.drive({ version: "v3", auth });
  console.log("b");
  const form = new formidable.IncomingForm();
  console.log("c");
  const tempFolder = "temp"; // Temporary folder to store uploaded files
  console.log("d");
  return new Promise((resolve, reject) => {
    form.parse(req, async (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      const file = files.file;
      const fileMetadata = {
        name: file.name,
      };

      // Move the uploaded file to the temporary folder
      const tempFilePath = `${tempFolder}/${file.name}`;
      fs.renameSync(file.path, tempFilePath);

      const media = {
        mimeType: file.type,
        body: fs.createReadStream(tempFilePath),
      };

      drive.files.create(
        {
          resource: fileMetadata,
          media: media,
          fields: "id",
        },
        (error, file) => {
          // Remove the temporary file after uploading
          fs.unlink(tempFilePath, (unlinkError) => {
            if (unlinkError) {
              console.error("Error removing temporary file:", unlinkError);
            }
          });

          if (error) {
            reject(error);
          } else {
            resolve(file.data.id);
          }
        }
      );
    });
  });
}

async function getAccessToken() {
  //   const session = await getSession();
  //   console.log("value", session);
  //   console.log("3");
  //   const token = await auth.getToken();
  //   console.log("4");
  //   console.log(token);
  //   auth.setCredentials(token.tokens);
  return true;
}
