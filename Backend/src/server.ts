const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const multer = require('multer');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY as String;
const DIRECTUS_URL = process.env.DIRECTUS_URL as String;

interface GenerateReportRequest {
    inputText: string;
    constructionSite: string;
    title: string;
}

// Helper function to handle the OpenAI API calls safely
async function getOpenAiResponse(prompt: string): Promise<string> {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',  // Ensure you're using the correct model
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.0,  // Adjust temperature as needed
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        return response.data.choices[0]?.message?.content || '';
    } catch (error: any) {
        console.error('OpenAI API request failed:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch data from OpenAI');
    }
}

async function extractMaterial(report: string): Promise<string> {
    const prompt = `
        Extract the "Materials Used" from the following text:
        ${report}
        
        Only return the materials mentioned, nothing else. If no materials are mentioned, return an empty result (no spaces, no zeros, nothing).
    `;
    return await getOpenAiResponse(prompt);
}

async function extractProblems(report: string): Promise<string> {
    const prompt = `
        Extract the "Problems/Comments" from the following text:
        ${report}
        
        Only return the problems or comments. If no problems or comments are mentioned, return an empty result (no spaces, no zeros, nothing).
    `;
    return await getOpenAiResponse(prompt);
}

async function extractFurtherNotes(report: string): Promise<string> {
    const prompt = `
        Extract the "Further Notes" from the following text:
        ${report}
        
        Only return the further notes. If no further notes are mentioned, return an empty result (no spaces, no zeros, nothing).
    `;
    return await getOpenAiResponse(prompt);
}

// Generate the report and handle extraction
app.post('/generate-report', async (req: any, res: any) => {
    const { inputText, constructionSite, title }: GenerateReportRequest = req.body;

    if (!inputText || !constructionSite || !title) {
        return res.status(400).json({ error: 'Input text, construction site, and title are required.' });
    }

    try {
        // Constructing the prompt for the OpenAI API call
        const prompt = `Create a report based on the following data:
            Report Title: ${title}
            Date of Creation: [Current Date]
            Construction Site: ${constructionSite}
            Work Description: ${inputText}

            Ensure that the required fields are filled. If materials, problems, or notes are mentioned, populate those fields. Otherwise, leave them blank—completely empty, no filler text.
            The report should be written in fluent text, not in a strict structure. Leave spaces and line breaks marked as '\\n' to preserve readability.
        `;

        const generatedReport: string = await getOpenAiResponse(prompt);

        if (!generatedReport) {
            console.log('Failed to generate report');
            return res.status(500).json({ error: 'Failed to generate the report.' });
        }

        // Additional extractions from the input text
        const materialUsed = await extractMaterial(inputText);
        const problems = await extractProblems(inputText);
        const furtherNotes = await extractFurtherNotes(inputText);

        const reportData = {
            title,
            construction_site: constructionSite,
            work_done_description: generatedReport,
            material_used_description: materialUsed || '',
            problems_emerged_description: problems || '',
            further_notes_description: furtherNotes || '',
            date_created: new Date().toISOString(),
        };

        try {
            const directusResponse = await axios.post(
                `${DIRECTUS_URL}/items/reports`,
                reportData
            );
            console.log(directusResponse.data); // Logge die Response-Daten
            return res.json({
                message: 'Report generated and uploaded to Directus',
                reportId: directusResponse.data.data.id,
            });
        } catch (error: any) {
            console.error('Error uploading to Directus:', error.response ? error.response.data : error.message);
            return res.status(500).json({ error: 'Failed to upload report to Directus' });
        }

    } catch (error) {
        console.error('Error generating report:', error);
        return res.status(500).json({ error: 'An error occurred while generating the report.' });
    }
});

// Endpoint to transcribe audio files using OpenAI Whisper
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/transcribe/:spokenLanguage', upload.single('file'), async (req: any, res: any) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file provided' });
        return;
    }

    const language = req.params.spokenLanguage || "";

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
        console.error('Error transcribing audio:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
});

// Endpoint for text translation
app.post('/translate/:translateInLanguage', async (req: any, res: any) => {
    let language = req.params.translateInLanguage || "de";
    language = language === "de" ? "german" : language === "en" ? "english" : "german";

    const prompt = `Translate the following text into ${language}: ${req.body.text}`;

    try {
        const translatedText = await getOpenAiResponse(prompt);
        res.json({ translatedText });
    } catch (error) {
        console.error("Error in translation:", error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});
