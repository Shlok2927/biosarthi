import { useEffect, useRef } from "react";

export const useSpeechRecognition = (
  setInputText: React.Dispatch<React.SetStateAction<string>>,
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognitionRef.current.onstart = () => {
        setIsSpeaking(true);
      };

      recognitionRef.current.onend = () => {
        setIsSpeaking(false);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error", event);
        setIsSpeaking(false);
      };
    } else {
      console.warn("SpeechRecognition API is not supported by this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [setInputText, setIsSpeaking]);

  const toggleSpeechRecognition = () => {
    if (recognitionRef.current) {
      if (recognitionRef.current.started) {
        recognitionRef.current.stop();
        setIsSpeaking(false);
      } else {
        recognitionRef.current.start();
        setIsSpeaking(true);
      }
    } else {
      console.warn("SpeechRecognition instance is not initialized.");
    }
  };

  return toggleSpeechRecognition;
};
