// import axios from "axios";

// export default async function generateResponse(req, res) {
//   const { text } = req.body;

//   const apiKey = process.env.OPENAI_API_KEY;
//   const url = "https://api.openai.com/v1/chat/completions";

//   try {
//     const response = await axios.post(
//       url,
//       {
//         prompt: text,
//         max_tokens: 100,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${apiKey}`,
//         },
//       }
//     );
//     console.log("API Response:", response.data);
//     const { choices } = response.data;
//     const generatedAnswer = choices[0].text.trim();

//     setTimeout(() => {
//       res.status(200).json({ answer: generatedAnswer });
//     }, 2000);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

const { Configuration, OpenAIApi } = require("openai");

export default async function generateResponse(req, res) {
  const { text } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  try {
    console.log("Inside");
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 7,
      stream: true,
    });

    console.log("Outside");

    const { choices } = response.data;
    const generatedAnswer = choices[0].text.trim();

    res.status(200).json({ answer: generatedAnswer });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}
