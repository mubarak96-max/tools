"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/tailwind/shared";

// TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceDictation() {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if the browser supports Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setSupported(false);
        setError("Your browser does not support Speech Recognition. Please try using Google Chrome, Microsoft Edge, or Safari.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US"; // Default language

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript;
          } else {
             // For a polished feel, you could show interim results, 
             // but appending only final results is safer for most users.
          }
        }
        
        if (currentTranscript) {
           setTranscript((prev) => prev ? prev + " " + currentTranscript : currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
           setError("Microphone access was denied. Please allow microphone permissions in your browser bar.");
           setIsListening(false);
        }
      };

      recognition.onend = () => {
        // If it stops automatically, we reset the scanning state.
        // However, continuous mode shouldn't stop unless we tell it to, or if there's a long pause.
        // If we want it to literally run forever, we could restart it here if `isListening` state is true.
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!supported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript(""); // Optionally clear, but usually we just append. Let's just append.
      setError(null);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        // If it's already started, this throws.
        console.error("Error starting recognition", err);
      }
    }
  };

  const handleClear = () => {
    setTranscript("");
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        
        <div className="grid gap-8 lg:grid-cols-1 max-w-4xl mx-auto w-full">
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Speech to Text</h2>
              {isListening && (
                <span className="flex items-center gap-2 text-sm font-semibold text-red-500 animate-pulse">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  Recording...
                </span>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="relative">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={supported ? "Click the microphone below to start speaking. Your words will appear here instantly..." : "Speech recognition is unsupported in this browser."}
                className="min-h-[350px] w-full rounded-[1.5rem] border border-border bg-background p-6 text-base font-medium text-foreground outline-none focus:ring-2 focus:ring-primary shadow-inner resize-y"
              />
              
              <div className="absolute right-4 bottom-4 flex gap-2">
                 {transcript && (
                  <button 
                    onClick={handleClear}
                    className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:bg-muted transition"
                    title="Clear Screen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                 )}
                 {transcript && <CopyButton value={transcript} />}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={toggleListening}
                disabled={!supported}
                className={`flex items-center justify-center gap-3 w-16 h-16 rounded-full transition-all shadow-lg hover:-translate-y-1 ${
                  isListening 
                    ? "bg-red-500 text-white shadow-red-500/30 scale-110" 
                    : "bg-primary text-primary-foreground shadow-primary/30"
                } ${!supported && "opacity-50 cursor-not-allowed"}`}
              >
                {isListening ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                )}
              </button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground pt-2">
              {isListening ? "Tap to pause dictation." : "Tap the microphone to start recording."}
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}
