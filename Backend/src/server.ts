process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
const DIRECTUS_URL = process.env.DIRECTUS_URL as string;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN as string;

interface GenerateReportRequest {
    inputText: string;
    constructionSite: string;
    title: string;
}

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
            Arbeit beschreiben: [Optional]

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

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});
