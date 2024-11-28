import { useRef, useState } from "react";


type Props = {
    spokenLanguage: string,
    translateInLanguage: string
}

export default function SpeechService({ spokenLanguage, translateInLanguage }: Props) {

    const [transcript, setTranscript] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);

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

                translate(data.text);
            };

            mediaRecorder.start();
            console.log("Aufnahme gestartet");

        } catch (error) {
            console.log("Microfon not started");
        }
    }

    async function translate(data: string) {
        await fetch(`http://localhost:3000/translate?language=${language}`, {
            method: 'POST',
            body: data
        });
    }



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
