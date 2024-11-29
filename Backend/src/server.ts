process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
app.use(cors());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const DIRECTUS_URL = process.env.DIRECTUS_URL

interface GenerateReportRequest {
    inputText: string;
    constructionSite: string;
    title: string;
}


app.post('/api/report/openAi/extractMaterials', async (req: any, res: any) => {
    console.log("inGPT");

    const { text } = req.body;

    if (!text) {
        return res.send('');
    }

    try {
        const material = await extractMaterial(text);
        return res.send(material);
    } catch (error) {
        console.error('Error extracting material:', error);
        return res.send('');
    }
});


async function extractMaterial(report: string): Promise<string> {
    const prompt = `
        Extrahiere bitte die "Verwendeten Materialien" aus folgendem Text:
        ${report}
        
        Gib nur das Material zurück, keine weiteren Informationen. Wenn keine Materialien erwähnt werden, gib ein leeres Ergebnis zurück (keine Leerzeichen, keine Nullen, gar nichts).
    `;

    try {
        const openAiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.0, // Minimale Temperatur für präzise Antworten
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        return openAiResponse.data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Error extracting material:', error);
        return '';
    }
}

async function extractProblems(report: string): Promise<string> {
    const prompt = `
        Extrahiere bitte "Probleme/Anmerkungen" aus folgendem Text:
        ${report}
        
        Gib nur die Probleme oder Anmerkungen zurück. Wenn keine Probleme oder Anmerkungen erwähnt werden, gib ein leeres Ergebnis zurück (keine Leerzeichen, keine Nullen, gar nichts).
    `;

    try {
        const openAiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.0, // Minimale Temperatur für präzise Antworten (temp = Streuung)
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        return openAiResponse.data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Error extracting problems:', error);
        return '';
    }
}

async function extractFurtherNotes(report: string): Promise<string> {
    const prompt = `
        Extrahiere bitte "Weitere Notizen" aus folgendem Text:
        ${report}
        
        Gib nur die weiteren Notizen zurück. Wenn keine weiteren Notizen erwähnt werden, gib ein leeres Ergebnis zurück (keine Leerzeichen, keine Nullen, gar nichts).
    `;

    try {
        const openAiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        return openAiResponse.data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Error extracting further notes:', error);
        return '';
    }
}

app.post('/generate-report', async (req: any, res: any) => {
    const { inputText, constructionSite, title }: GenerateReportRequest = req.body;

    if (!inputText || !constructionSite || !title) {
        return res.status(400).json({ error: 'Input text, construction site, and title are required.' });
    }

    try {
        const prompt = `Erstelle einen Bericht basierend auf den folgenden Daten:

            Bericht ${title}:
            Datum der Erstellung: [Aktuelles Datum, Pflichtfeld]
            Baustelle: ${constructionSite} (Pflichtfeld)
            Arbeit beschreiben: [Optional] // wenn keine vorhanden leer zurück geben nichts erfinden!!

            Stelle sicher, dass die Pflichtfelder befüllt sind. Wenn Informationen zu Materialien, Problemen oder Notizen erwähnt werden, fülle diese Felder aus, andernfalls lasse sie leer - komplett leer, es darf einfach nichts drinnen stehen.
            Die Baustellen ID wird oben automatisch erstellt, einfach leer lassen. Das ganze soll als schöner Text und nicht strikt nach der vorgegebenen Struktur aufgebaut werden (Fließtext). Außerdem sollen Leerzeichen und Zeilenumbrüche mit '\\n' markiert bzw. mit '\\n' aufgeteilt werden, sodass es als Text später noch lesbar ist und nicht zusammengepresst wird.
        `


        const openAiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const generatedReport: string = openAiResponse.data.choices[0]?.message?.content || "Kein Bericht generiert.";

        if (!generatedReport) {
            return res.status(500).json({ error: 'Failed to generate the report.' });
        }

        const constructionSiteId = Math.floor(Math.random() * 1000000);

        const materialUsed = await extractMaterial(inputText);
        const problems = await extractProblems(inputText);
        const furtherNotes = await extractFurtherNotes(inputText);

        const reportData = {
            title,
            construction_site: constructionSite,
            construction_site_id: constructionSiteId,
            work_done_description: generatedReport,
            material_used_description: materialUsed || '',
            problems_emerged_description: problems || '',
            further_notes_description: furtherNotes || '',
            date_created: new Date().toISOString(),
        };

        console.log("Generierte Berichtsdaten:");
        console.log(reportData);

        const directusResponse = await axios.post(
            `${DIRECTUS_URL}/items/reports`,
            reportData
        );

        return res.json({
            message: 'Report generated and uploaded to Directus',
            reportId: directusResponse.data.data.id,
        });

    } catch (error) {
        console.error('Error generating report:', error);
        return res.status(500).json({ error: 'An error occurred while generating the report.' });
    }
});


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
    //console.log(language);

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


app.post('/translate/:translateInLanguage', async (req: any, res: any) => {
    let language = req.params.translateInLanguage || "de";
    //console.log(language);

    switch (language) {
        case "de": language = "german"; break;
        case "en": language = "english"; break;
        default: language = "german";
    }

    const prompt = `Translate the following text into ${language}: ${req.body.text}`;

    try {
        const completion = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        // Extrahiere nur die Textantwort
        const translatedText = completion.data.choices[0]?.message?.content || 'No translation available';
        console.log("Translated Text:", translatedText);

        res.json({ translatedText });

    } catch (error) {
        console.error("Error in translation:", error);
        res.status(500).json({ error: 'Translation failed' });
    }
});



app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});
