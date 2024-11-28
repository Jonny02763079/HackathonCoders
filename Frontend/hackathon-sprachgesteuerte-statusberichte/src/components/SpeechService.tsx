import React, { useRef, useState } from 'react'

type Props = {}

export default function SpeechService({ }: Props) {

    const [transcript, setTranscript] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);


    // const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    // recognition.lang = 'de-DE';

    // recognition.onresult = (event: SpeechRecognitionEvent) => {
    //     const result = event.results[0][0].transcript;
    //     setTranscript(result); // Erkannten Text speichern
    // };



    //let mediaRecorder: MediaRecorder | null = null;

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);


    async function startRecording() {
        try {
            setIsRecording(true);
            setTranscript('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                const audioBlob = event.data;
                console.log("inEvent")
                console.log("Audio aufgenommen:", audioBlob);
                // Audio könnte hier verarbeitet oder hochgeladen werden
            };

            mediaRecorder.start();
            console.log("Aufnahme gestartet");

        } catch (error) {
            console.log("Microfon not started");
        }
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
                <button onClick={isRecording ? stopRecording : startRecording}>{isRecording ? "startRecording" : "stopRecording"}</button>
            </div>
            <div>
                {transcript}
            </div>
        </div>
    )
}
