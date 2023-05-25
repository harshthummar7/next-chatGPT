import formidable from "formidable";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

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
    // const { session } = fields;

    // const sessionValue = JSON.parse(session);
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,

      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    try {
      const { data } = await drive.files.create({
        requestBody: {
          name: file.originalFilename,
          parents: ["1LlaefbvZpW0qq-VEYk8w3hvoMmis-NDo"],
        },
        //"1vxXjt1JRDrdDLjbomta3rMk6HfhygqGj"
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(`${file.filepath}`),
        },
      });

      const dataUrl = await getFileContent(data.id);
      console.log(dataUrl);
      res.status(200).json({ fileId: data.id, url: dataUrl });
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
    const dataUrl = `data:${mimeType};base64,${data}`;

    return dataUrl;
  } catch (error) {
    console.error("Error retrieving file content:", error);
    throw error;
  }
}

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_ID,
//   process.env.GOOGLE_SECRET,
//   process.env.REDIRECT_URI
// );

// oauth2Client.setCredentials({
//   access_token: sessionValue.accessToken,
//   refresh_token: sessionValue.refreshToken,
//   expiry_date: sessionValue.expires,
//   scope: ["https://www.googleapis.com/auth/drive"],
// });

// const drive = google.drive({ version: "v3", auth: oauth2Client });

// console.log(oauth2Client);
//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
// if (req.method === "GET") {
//   // Handle GET request separately
//   // Continue with the desired logic for GET requests
//   res.status(200).json({ message: "GET request received." });
//   return;
// }
// if (req.method !== "POST") {
//   res.status(405).end(); // Method Not Allowed
//   return;
// }

// const form = new formidable.IncomingForm();
// const wss = new WebSocket.Server({ noServer: true });

// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     console.log("Received message from client: ", message);
//   });

//   // Send progress updates to the client
//   const sendProgressUpdate = (progress) => {
//     ws.send(JSON.stringify({ progress }));
//   };

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       res.status(500).json({ error: "Failed to parse form data." });
//       return;
//     }

//     const { file } = files;
//     const { session } = fields;

//     const sessionValue = JSON.parse(session);
//     const auth = new google.auth.GoogleAuth({
//       keyFile: keyFilePath,
//       scopes: ["https://www.googleapis.com/auth/drive"],
//     });

//     const drive = google.drive({ version: "v3", auth });

//     try {
//       const fileSize = fs.statSync(file.filepath).size.toString();
//       let uploadedBytes = 0;

//       fs.createReadStream(file.filepath)
//         .on("data", (chunk) => {
//           uploadedBytes += chunk.length;
//           const progress = Math.round((uploadedBytes / fileSize) * 100);
//           sendProgressUpdate(progress);
//         })
//         .on("end", async () => {
//           sendProgressUpdate(100);

//           try {
//             const { data } = await drive.files.create({
//               requestBody: {
//                 name: file.originalFilename,
//                 parents: ["1LlaefbvZpW0qq-VEYk8w3hvoMmis-NDo"],
//               },
//               media: {
//                 mimeType: file.mimetype,
//                 body: fs.createReadStream(file.filepath),
//               },
//             });

//             console.log(data);
//             res.status(200).json({ fileId: data.id });
//           } catch (error) {
//             res.status(500).json({ error: error });
//           }

//           ws.close();
//         });
//     } catch (error) {
//       res.status(500).json({ error: error });
//     }
//   });
// });

// wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
//   wss.emit("connection", ws, req);
// });
