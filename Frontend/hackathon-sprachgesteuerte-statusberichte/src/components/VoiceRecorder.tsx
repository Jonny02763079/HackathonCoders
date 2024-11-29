import { useRef, useState } from "react";

type Props = {
    spokenLanguage: string,
    translateInLanguage: string
    constructionSite: string,
    title: string,
}

export default function SpeechService({ spokenLanguage, translateInLanguage, constructionSite, title }: Props) {

    const [transcript, setTranscript] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const [translatedText, setTranslatedText] = useState<string>('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    async function startRecording() {
        try {
            setIsRecording(true);
            setTranscript('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = async (event) => {
                const audioBlob = event.data;

                const audioFile = new Blob([audioBlob], { type: 'audio/mp3' });

                const formData = new FormData();
                formData.append("file", audioFile, "speech.mp3");

                const response = await fetch(`http://localhost:3000/transcribe/${spokenLanguage}`, {
                    method: 'POST',
                    body: formData
                });


                const data = await response.json();
                console.log('Transcription:', data);

                setTranscript(data.text);

                if (spokenLanguage === translateInLanguage) {
                    console.log("no translation - same languages");
                    //await sendToReport(data.text, constructionSite, title);
                } else {
                    await translate(data);
                }

            };

            mediaRecorder.start();
            console.log("Aufnahme gestartet");

        } catch (error) {
            console.log("Microfon not started");
        }
    }

    async function translate(data: any) {
        const result = await fetch(`http://localhost:3000/translate/${translateInLanguage}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        //console.log(result);
        const translatedData = result.json();
        //console.log(translatedData);
        setTranslatedText(await translatedData);
    }


    // async function sendToReport(text: string, constructionSite: string, title: string) {
    //     const result = await fetch(`http://localhost:3000//`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: {
    //             text: text,
    //             constructionSite: constructionSite,
    //             title: title
    //         }
    //     });
    // }


    function stopRecording() {

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop(); // Stoppe die Aufnahme
            setIsRecording(false);
            console.log('Aufnahme gestoppt');
        } else {
            console.error('MediaRecorder ist nicht initialisiert.');
        }
    }

    return (
        <div>
            <div>
                <button onClick={isRecording ? stopRecording : startRecording}>{isRecording ? "stop Recording" : "start Recording"}</button>
            </div>
            <div>
                {transcript}
            </div>
        </div>
    )
}
