import { useRef, useState } from "react";
import startRec from "../assets/startRec.png";
import stopRec from "../assets/stopRec.png";

type Props = {
  spokenLanguage: string,
  translateInLanguage: string
  translatedText: string
  setTranslatedText: React.Dispatch<React.SetStateAction<string>>;
}

export default function AudioWaveRecorder({ spokenLanguage, translateInLanguage, translatedText, setTranslatedText, }: Props) {
  const [isRecording, setIsRecording] = useState(false);

  //------------------------

  const [transcript, setTranscript] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  async function startRecording() {
    try {
      setIsRecording(true);
      setTranscript('');
      setTranslatedText('');
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
          setTranslatedText(data.text);
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

    const translatedData = result.json();
    setTranslatedText(await translatedData);
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Aufnahme gestoppt');
    } else {
      console.error('MediaRecorder ist nicht initialisiert.');
    }
  }

  //----------------------

  return (
    <div className="flex justify-between items-center gap-x-5">
      <button onClick={isRecording ? stopRecording : startRecording}>
        <div className="w-[50px] h-[50px] bg-[#3777AD] rounded-full flex justify-center items-center transition-transform duration-100 ease-in-out hover:bg-[#265f7d] delay-300">
          <img
            src={isRecording ? stopRec : startRec}
            alt="play"
            className="max-w-[20px] max-h-[20px]"
          />
        </div>
      </button>
      <div>
        <div className="flex  justify-center items-center">
          <div className="relative  w-80 h-[40px] overflow-hidden">
            {/* Dummy-Wellenanimation */}
            <div
              className={`flex space-x-1 w-full h-full items-center justify-center ${isRecording
                ? "animate-wave transition-colors duration-1000 delay-500"
                : "opacity-30"
                }`}
            >
              {Array.from({ length: 30 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#3777AD] rounded-1xl w-2"
                  style={{
                    height: 20, // Zufällige Höhe für die Balken
                    animationDelay: `${index * 100}ms`, // Verzögerung für jedes Balken
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
