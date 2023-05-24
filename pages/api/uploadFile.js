// // import formidable from "formidable";
// // import fs from "fs";
// // import { google } from "googleapis";
// const { google } = require("googleapis");
// const { OAuth2 } = google.auth;
// const fs = require("fs");

// export const config = {
//   api: {
//     externalResolver: true,
//     bodyParser: false,
//   },
// };
// export default async function handler(req, res) {
//   console.log("entry level", req);
//   const oauth2Client = new OAuth2(
//     process.env.GOOGLE_ID,
//     process.env.GOOGLE_SECRET,
//     process.env.REDIRECT_URI
//   );

//   // Set the scope for accessing Google Drive
//   const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

//   // Generate the authorization URL
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });

//   // Redirect the user to the authorization URL
//   // In a Next.js app, you can use Next.js' built-in routing mechanism or render a link to the URL
//   // For simplicity, we'll log the URL here
//   console.log("Authorize this app by visiting:", authUrl);
//   return res.status(200).json({ message: authUrl });
//   // Once the user authorizes the app and gets redirected back,
//   // you'll receive an authorization code in the query parameters
//   const authorizationCode = "frgfgf";

//   // Exchange the authorization code for access and refresh tokens
//   const { tokens } = await oauth2Client.getToken(authorizationCode);

//   // Set the access and refresh tokens for the OAuth2 client
//   oauth2Client.setCredentials(tokens);

//   // Create a new Google Drive instance
//   const drive = google.drive({ version: "v3", auth: oauth2Client });

//   // Create a file metadata object
//   const fileMetadata = {
//     name: "your_file_name.ext",
//   };

//   // Create a media object
//   const media = {
//     mimeType: "application/octet-stream",
//     body: fs.createReadStream("path/to/your/file.ext"),
//   };

//   // Upload the file to Google Drive
//   const response = await drive.files.create({
//     resource: fileMetadata,
//     media: media,
//     fields: "id",
//   });

//   console.log("File uploaded. File ID:", response.data.id);
// }
// ///////////////////////////////////////////////////////////////////////////////
// // export default async function handler(req, res) {
// //   if (req.method !== "POST") {
// //     return res.status(405).json({ error: "Method Not Allowed" });
// //   }

// //   const form = new formidable.IncomingForm();
// //   const tempFolder = "./temp"; // Set your desired temporary folder
// //   try {
// //     form.parse(req, async (error, fields, files) => {
// //       console.log("try");
// //       if (error) {
// //         console.log(error);
// //         return res.status(400).json({ error: "Error parsing form data" });
// //       }

// //       const file = files.file;
// //       const session = JSON.parse(fields.session);

// //       // Use the session object as needed
// //       console.log("file", file);
// //       console.log("Session:", session);

// //       try {
// //         const auth = new google.auth.GoogleAuth({
// //           credentials: {
// //             client_id: process.env.GOOGLE_ID,
// //             client_secret: process.env.GOOGLE_SECRET,
// //             redirect_uri: process.env.REDIRECT_URI,
// //           },
// //           token: {
// //             access_token: session.accessToken,
// //             refresh_token: session.refreshToken,
// //             expiry_date: session.expires,
// //           },
// //         });

// //         const driveClient = await google.drive({
// //           version: "v3",
// //           auth,
// //         });

// //         const fileMetadata = {
// //           name: file.name,
// //         };

// //         const media = {
// //           mimeType: file.type,
// //           body: fs.createReadStream(file.path),
// //         };

// //         const driveResponse = await driveClient.files.create({
// //           resource: fileMetadata,
// //           media: media,
// //           fields: "id",
// //         });

// //         fs.unlink(file.path, (unlinkError) => {
// //           if (unlinkError) {
// //             console.error("Error removing temporary file:", unlinkError);
// //           }
// //         });

// //         const fileId = driveResponse.data.id;

// //         return res.status(200).json({ fileId });
// //       } catch (uploadError) {
// //         console.error("Error uploading file:", uploadError);
// //         return res.status(500).json({ error: "Error uploading file" });
// //       }
// //     });
// //   } catch (parseError) {
// //     console.error("Error parsing form data:", parseError);
// //     return res.status(400).json({ error: "Error parsing form data" });
// //   }
// // }
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // export default async function handler(req, res) {
// //   if (req.method !== "POST") {
// //     return res.status(405).json({ error: "Method Not Allowed" });
// //   }

// //   const form = new formidable.IncomingForm();
// //   const tempFolder = "./temp"; // Set your desired temporary folder

// //   form.parse(req, async (error, fields, files) => {
// //     console.log("try");
// //     if (error) {
// //       console.log(error);
// //       return res.status(400).json({ error: "Error parsing form data" });
// //     }

// //     const file = files.file;
// //     const session = JSON.parse(fields.session);

// //     // Use the session object as needed
// //     // console.log("data", file);

// //     console.log("Session:", session);

// //     try {
// //       const auth = new google.auth.GoogleAuth({
// //         credentials: {
// //           client_id: process.env.GOOGLE_ID,
// //           client_secret: process.env.GOOGLE_SECRET,
// //           redirect_uri: process.env.REDIRECT_URI,
// //           client_email: session.user.email,
// //           private_key: process.env.PRIVATE_KEY,
// //         },
// //         token: {
// //           access_token: session.accessToken,
// //           refresh_token: session.refreshToken,
// //           expiry_date: session.expires,
// //         },
// //       });

// //       const driveClient = await google.drive({
// //         version: "v3",
// //         auth,
// //       });

// //       const fileMetadata = {
// //         name: file.name,
// //       };

// //       const tempPath = file.filepath; // Temporary path provided by formidable
// //       console.log("path", tempPath, typeof tempPath);
// //       const newPath = `${tempFolder}/${file.name}`; // Desired path to save the file

// //       fs.rename(tempPath, newPath, (renameError) => {
// //         if (renameError) {
// //           console.error("Error moving file:", renameError);
// //           return res.status(500).json({ error: "Error moving file" });
// //         }

// //         const media = {
// //           mimeType: file.type,
// //           body: fs.createReadStream(newPath),
// //         };

// //         driveClient.files.create(
// //           {
// //             resource: fileMetadata,
// //             media: media,
// //             fields: "id",
// //           },
// //           (uploadError, driveResponse) => {
// //             fs.unlink(newPath, (unlinkError) => {
// //               if (unlinkError) {
// //                 console.error("Error removing temporary file:", unlinkError);
// //               }
// //             });

// //             if (uploadError) {
// //               console.error("1 Error uploading file:", uploadError);
// //               return res.status(500).json({ error: uploadError });
// //             }

// //             const fileId = driveResponse.data.id;

// //             return res.status(200).json({ fileId });
// //           }
// //         );
// //       });
// //     } catch (uploadError) {
// //       console.error("3 Error uploading file:", uploadError);
// //       return res.status(500).json({ error: "4 Error uploading file" });
// //     }
// //   });
// // }
import formidable from "formidable";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { GoogleAuth } from "google-auth-library";

export const config = {
  api: {
    bodyParser: false, // Disable the default Next.js body parser
  },
};

const keyFilePath = path.join(process.cwd(), "credential.json");

export default async function upload(req, res) {
  if (req.method !== "POST") {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Failed to parse form data." });
      return;
    }

    const { file } = files;
    const { session } = fields;

    const sessionValue = JSON.parse(session);
    // const auth = new google.auth.GoogleAuth({
    //   keyFile: keyFilePath,

    //   scopes: ["https://www.googleapis.com/auth/drive"],
    // });

    // const drive = google.drive({ version: "v3", auth });

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_ID,
      process.env.GOOGLE_SECRET,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: sessionValue.accessToken,
      refresh_token: sessionValue.refreshToken,
      expiry_date: sessionValue.expires,
      scope: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    console.log(oauth2Client);
    try {
      const { data } = await drive.files.create({
        requestBody: {
          name: file.originalFilename,
        },

        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(`${file.filepath}`),
        },
      });
      console.log(data);
      res.status(200).json({ fileId: data.id });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });
}
