// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

const OpenAI = require('openai');
const openai = new OpenAI();

app.use(cors());
app.use(express.json());


// function encodeImage(imagePath) {
//   const image = fs.readFileSync(imagePath);
//   return image.toString('base64');
// }

app.post('/openai', async (req, res) => {
  try {

    const { image } = req.body;
    // const base64Image = encodeImage(image);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Give me the type of animal, species, endangered level, only those words nothing else" },
            {
              type: "image_url",
              image_url: {
                "url": `${image}`,
              },
            },
          ],
        },
      ],
    });
    
    res.json(response.choices[0]);

  } catch (error) {
    console.error('Error during label detection:', error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
