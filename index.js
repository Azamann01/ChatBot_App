// Gemini API segment
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "_AIzaSyA8GaBf-smt7SfdFNkzUFvlshnRNZYy_hA";

// const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let messages = {
  history: [],
};

async function sendMessage() {
  const userMessage = document.querySelector(".chatbot-segment input").value;
  if (userMessage.length) {
    try {
      document.querySelector(".chatbot-segment input").value = "";
      document
        .querySelector(".chatbot-segment .chat-section")
        .insertAdjacentHTML(
          "beforeend",
          `
        <div class="chat-sender">
          <p>${userMessage}</p>
        </div>`
        );

      const chat = model.startChat(messages);

      let result = await chat.sendMessage(userMessage);
      document
        .querySelector(".chatbot-segment .chat-section")
        .insertAdjacentHTML(
          "beforeend",
          `
        <div class="model">
          <p>${result.response.text()}</p>
        </div>`
        );

      // UPDATING THE HISTORY
      messages.history.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      messages.history.push({
        role: "model",
        parts: [{ text: result.response.text() }],
      });
    } catch (error) {
      document
        .querySelector(".chatbot-segment .chat-section")
        .insertAdjacentHTML(
          "beforeend",
          `
        <div class="error-handler">
          <p>Please try again, later!</p>
        </div>`
        );
    }
  }
}
// INPUT AND SEND MESSAGE SECTION
document
  .querySelector(".chatbot-segment .send-button")
  .addEventListener("click", () => sendMessage());

// TARGETING OUR ENTER KEY WITH SEND BUTTON
document
  .getElementById("input-text")
  .addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      document.getElementById("send-btn").click();
    }
  });
