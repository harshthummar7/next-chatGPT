import { Configuration, OpenAIApi } from "openai";
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
      model: "gpt-3.5-turbo",
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
