import { useState } from "react";
import startRec from "../assets/startRec.png";
import stopRec from "../assets/stopRec.png";

export default function AudioWaveRecorder() {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-center gap-x-5">
      <button onClick={toggleRecording}>
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
              className={`flex space-x-1 w-full h-full items-center justify-center ${
                isRecording
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
