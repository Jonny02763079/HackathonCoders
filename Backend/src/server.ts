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
        Extrahiere die "Verwendeten Materialien" aus folgendem Text:
        ${report}
        
        Gib nur die Materialien zurück, die erwähnt werden, nichts anderes. Wenn keine Materialien erwähnt werden, gib ein leeres Ergebnis zurück (keine Leerzeichen, keine Nullen, gar nichts).
    `;
    return await getOpenAiResponse(prompt);
}

async function extractProblems(report: string): Promise<string> {
    const prompt = `
        Extrahiere die "Probleme/Kommentare" aus folgendem Text:
        ${report}
        
        Gib nur die Probleme oder Kommentare zurück. Wenn keine Probleme oder Kommentare erwähnt werden, gib ein leeres Ergebnis zurück (keine Leerzeichen, keine Nullen, gar nichts).
    `;
    return await getOpenAiResponse(prompt);
}

async function extractFurtherNotes(report: string): Promise<string> {
    const prompt = `
        Extrahiere die "Weitere Notizen" aus folgendem Text:
        ${report}
        
        Gib nur die weiteren Notizen zurück. Wenn keine weiteren Notizen erwähnt werden, gib ein leeres Ergebnis zurück (keine Leerzeichen, keine Nullen, gar nichts).
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
        const prompt = `Erstelle einen Bericht basierend auf den folgenden Daten:
            Berichtstitel: ${title}
            Erstellungsdatum: [füge hier das aktuelle Datum in TT-MM-JJ ein]
            Baustelle: ${constructionSite}
            Arbeitsbeschreibung: ${inputText}

            Stelle sicher, dass die erforderlichen Felder ausgefüllt sind. Wenn Materialien, Probleme oder Anmerkungen erwähnt werden, fülle diese Felder aus. Andernfalls lasse sie leer—komplett leer, ohne Platzhaltertext.
            Der Bericht sollte in fließendem Text verfasst werden, nicht in einer strikten Struktur. Lasse Leerzeichen und Zeilenumbrüche als '\\n' markiert, um die Lesbarkeit zu erhalten.
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
