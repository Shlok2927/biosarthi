// speechRecognition.d.ts

declare module "speech-recognition" {
  // Define the SpeechRecognition interface
  interface SpeechRecognition extends EventTarget {
    new (): SpeechRecognition;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    abort(): void;
    onspeechstart: ((this: SpeechRecognition, event: Event) => void) | null;
    onspeechend: ((this: SpeechRecognition, event: Event) => void) | null;
    onresult:
      | ((this: SpeechRecognition, event: SpeechRecognitionEvent) => void)
      | null;
    onerror:
      | ((this: SpeechRecognition, event: SpeechRecognitionError) => void)
      | null;
    onstart: ((this: SpeechRecognition, event: Event) => void) | null;
    onend: ((this: SpeechRecognition, event: Event) => void) | null;
    readonly started: boolean; // Added property for detecting if recognition is started
  }

  // Define the SpeechRecognitionEvent interface
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  // Define the SpeechRecognitionResultList interface
  interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
  }

  // Define the SpeechRecognitionResult interface
  interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    [index: number]: SpeechRecognitionAlternative;
  }

  // Define the SpeechRecognitionAlternative interface
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }

  // Define the SpeechRecognitionError interface
  interface SpeechRecognitionError extends Event {
    error: string;
    message: string;
  }

  // Define the window interface with SpeechRecognition or webkitSpeechRecognition
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
