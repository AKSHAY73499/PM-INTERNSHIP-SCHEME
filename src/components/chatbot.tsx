
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Bot, Mic, Send, X, Languages, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { multilingualChatbot } from "@/ai/flows/multilingual-chatbot-support";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  audioUrl?: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "kn" | "hi">("en");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSend(new Event("submit"), transcript);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          toast({
            variant: "destructive",
            title: "Voice Error",
            description: "Could not recognize speech. Please try again.",
          });
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        toast({
            variant: "destructive",
            title: "Unsupported Browser",
            description: "Voice recognition is not supported in your browser.",
        })
      }
    }
  }, [language, toast]);

  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const handlePlayAudio = (audioUrl: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
    }
  };

  const handleSend = async (e: FormEvent | Event, messageText: string = input) => {
    e.preventDefault();
    if (!messageText.trim() || isLoading) return;
  
    const userMessageId = Date.now().toString();
    const userMessage: Message = { id: userMessageId, text: messageText, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
  
    try {
      const result = await multilingualChatbot({ language, message: messageText });
      
      const botMessageId = (Date.now() + 1).toString();
      const botMessage: Message = { id: botMessageId, text: result.response, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
  
      try {
        const { audioUrl } = await textToSpeech({ text: result.response });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, audioUrl } : msg
          )
        );
      } catch (audioError: any) {
        console.error("Text-to-speech error:", audioError);
        let description = "Could not generate audio for the response.";
        if (audioError?.message?.includes('429 Too Many Requests') || audioError?.message?.includes('quota')) {
          description = "Audio generation is temporarily unavailable due to high demand (quota exceeded). Please try again later."
        }
        toast({
            variant: "destructive",
            title: "Audio Generation Failed",
            description: description,
        });
      }
  
    } catch (chatError: any) {
      console.error("Chatbot error:", chatError);
      const errorId = (Date.now() + 1).toString();
      let errorText = "Sorry, I couldn't process that. Please try again.";
      if (chatError?.message?.includes('503 Service Unavailable') || chatError?.message?.includes('quota')) {
        errorText = "The AI service is currently overloaded or has reached its quota. Please try again in a few moments.";
      }
      const errorMessage: Message = {
        id: errorId,
        text: errorText,
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} />
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open Chatbot"
      >
        <Bot className="h-8 w-8" />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader className="pr-10">
            <SheetTitle className="font-headline flex items-center gap-2">
              <Bot className="text-primary"/> AI Assistant
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 p-2 border-b">
                <Languages className="h-4 w-4"/>
                <Select value={language} onValueChange={(value: "en" | "kn" | "hi") => setLanguage(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="kn">Kannada</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2",
                      msg.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs rounded-lg p-3 text-sm lg:max-w-md",
                        msg.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p>{msg.text}</p>
                    </div>
                     {!msg.isUser && msg.audioUrl && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePlayAudio(msg.audioUrl!)}
                            className="text-muted-foreground"
                        >
                            <Volume2 className="h-5 w-5" />
                        </Button>
                     )}
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="max-w-xs rounded-lg p-3 text-sm lg:max-w-md bg-muted">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-0"></div>
                                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <SheetFooter>
            <form onSubmit={handleSend} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button type="button" variant={isListening ? "destructive" : "outline"} size="icon" onClick={handleListen} disabled={!recognitionRef.current || isLoading}>
                <Mic className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
