"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import ChatInterface from "./chatInterface";
import { useSpeechRecognition } from "@/utils/speechRecognition";

export default function HomePage() {
  // State to manage the input text value
  const [inputText, setInputText] = useState<string>("");
  // State to toggle between showing the chat interface or not
  const [showChat, setShowChat] = useState<boolean>(false);
  // State to manage if speech recognition is active or not
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  // State to manage the current suggestions displayed
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);

  // Using the speech recognition hook to toggle speech recognition and update input text
  const toggleSpeechRecognition = useSpeechRecognition(
    setInputText,
    setIsSpeaking
  );

  // Handler for input field changes to update the state with the new value
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value),
    []
  );

  // Handler to show the chat interface when Enter key is pressed
  const handleInputKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputText.trim()) {
        setShowChat(true);
      }
    },
    [inputText]
  );

  // Handler to toggle speech recognition on and off
  const handleSpeakClick = useCallback(() => {
    toggleSpeechRecognition(isSpeaking);
  }, [isSpeaking, toggleSpeechRecognition]);

  // Handler to go back from the chat interface and reset the input text
  const handleBack = useCallback(() => {
    setShowChat(false);
    setInputText("");
  }, []);

  // Hardcoded suggestions for users to choose from
  const allSuggestions = [
    "What is biogas?",
    "How is biogas produced?",
    "Benefits of biogas?",
    "Biogas vs natural gas?",
    "Biogas and greenhouse gases?",
    "Materials for biogas production?",
    "Biogas in rural areas?",
    "Biogas plant setup cost?",
    "Biogas energy efficiency?",
    "Biogas in transportation?",
  ];

  // Effect to rotate suggestions every 5 seconds
  useEffect(() => {
    const rotateSuggestions = () => {
      // Shuffle suggestions and select the top 3
      const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
      setCurrentSuggestions(shuffled.slice(0, 3));
    };

    rotateSuggestions(); // Initial suggestion rotation
    const intervalId = setInterval(rotateSuggestions, 5000); // Rotate suggestions every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handler for clicking a suggestion to set it as input text and show the chat
  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setShowChat(true);
  };

  // If showChat is true, render the ChatInterface component
  if (showChat) {
    return <ChatInterface initialMessage={inputText} onBack={handleBack} />;
  }

  return (
    <div className="min-h-full bg-white text-gray-800 overflow-hidden flex justify-center ">
      <header className="fixed top-0 w-[100vw] z-10  bg-white bg-opacity-90 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            BioSarthi
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="pt-16 box-border">
        <section className="relative h-screen flex flex-col items-center justify-center px-4">
          <div className="z-10 text-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/biosarthi-logo-2sEzrkSriSDGPLl9DwFUDoGep5VCwn.png"
              alt="BioSarthi Logo"
              className="mx-auto mb-8 w-64 h-auto"
            />
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-green-600">
              Your Gateway to Biogas Innovation
            </h1>
            <div className="w-full max-w-md mx-auto mt-8 space-y-2">
              <Input
                type="text"
                placeholder="Ask me anything about Biogas..."
                className="w-full border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
              />
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ease-in-out h-12"
                onClick={handleSpeakClick}
              >
                <div className="flex items-center justify-center w-full">
                  <Mic
                    className={`h-5 w-5 mr-2 ${
                      isSpeaking ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="relative overflow-hidden h-6">
                    <span
                      className={`absolute left-0 transition-transform duration-300 ease-in-out ${
                        isSpeaking ? "-translate-y-full" : "translate-y-0"
                      }`}
                    >
                      Speak your question
                    </span>
                    <span
                      className={`absolute left-0 transition-transform duration-300 ease-in-out ${
                        isSpeaking ? "translate-y-0" : "translate-y-full"
                      }`}
                    >
                      Listening...
                    </span>
                  </span>
                </div>
              </Button>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Try asking about:
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {currentSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-sm bg-white text-green-600 border-green-400 hover:bg-green-50 transition-all duration-200 transform hover:scale-105"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            {["About", "Marketplace", "Patent", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
