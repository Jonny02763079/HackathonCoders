const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Setze OpenAI API-Schlüssel
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY, // Ersetze dies durch deinen API-Schlüssel
});

const app = express();
app.use(cors());
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/transcribe/:spokenLanguage', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file provided' });
        return;
    }
    const language = req.params.language || 'de';
    console.log("language");

    try {
        const audioBuffer = req.file.buffer;

        const tempFilePath = path.join(__dirname, 'temp_audio.mp3');
        fs.writeFileSync(tempFilePath, audioBuffer);

        const transcription = await openai.audio.transcriptions.create({
            model: 'whisper-1',
            file: fs.createReadStream(tempFilePath),
            response_format: 'text',
            language: language
        });

        fs.unlinkSync(tempFilePath);
        res.json({ text: transcription });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
});



// app.post('/translate', async (req, res) => {
//     try {
//         const completion = await openai.chat..create({
//             model: "gpt-4o",
//             messages: [
//                 { "role": "user", "content": "übersetze den folgenden Text:" + req }
//             ]
//         });
//         res(completion);
//     } catch {

//     }
// });



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
