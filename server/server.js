import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {OpenAI} from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

const app = express();
//middlewares
app.use(cors()); //cross origin request from client to server end
app.use(express.json()); // send json from front to back

app.get('/', async (req, res) => {
    res.status(200).send({
      message: 'Hello from OpenAI!'
    })
})

app.post('/', async (req, res) => {
    try {
      const prompt = req.body.prompt;
  
      const response = await openai.completions.create({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0, // Higher values means the model will take more risks.
        max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
        top_p: 1, // alternative to sampling with temperature, called nucleus sampling
        frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
        });
  
    res.status(200).send({
        bot: response.choices[0].text
    });
  
    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
})
app.listen(5000, () => console.log('AI server started on http://localhost:5000'))