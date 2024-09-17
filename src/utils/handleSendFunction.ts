// Function to handle sending messages in a chat
export const handleMessageSend = (
  inputText: string,
  setMessages: React.Dispatch<
    React.SetStateAction<{ type: "user" | "bot"; content: string }[]>
  >,
  setInputText: React.Dispatch<React.SetStateAction<string>>
) => {
  if (inputText.trim()) {
    // Add the user's message to the chat
    setMessages((prev) => [...prev, { type: "user", content: inputText }]);

    // Simulate a bot response (this can be replaced with an actual API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "I'm processing your question and will respond shortly.",
        },
      ]);
    }, 1000);

    setInputText(""); // Clear the input field
  }
};
