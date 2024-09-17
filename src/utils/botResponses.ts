// Function to simulate bot response (can be replaced with API call)
export const simulateBotResponse = (
  setMessages: React.Dispatch<
    React.SetStateAction<{ type: "user" | "bot"; content: string }[]>
  >
) => {
  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        content:
          "I'm processing your question and will provide more information shortly.",
      },
    ]);
  }, 1000); // Delay to mimic processing time
};
