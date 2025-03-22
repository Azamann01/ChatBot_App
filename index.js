// Gemini API segment
import { GoogleGenerativeAI } from "@google/generative-ai";
const chatInfo = `
Phone:
"Call us at +1-555-1234 for customer support."
Email:
"You can reach us at support@company.com for inquiries."
Customer Support Hours:
"Our customer support team is available Monday to Friday, from 9 AM to 6 PM."

Return & Exchange Policies
General Return Policy:
"You can return items within 30 days of purchase with proof of receipt. Items must be unused and in their original packaging."
Special Conditions:
"Gift cards, downloadable software, and opened electronics are not eligible for returns."
How to Initiate a Return:
"To initiate a return, please visit our store or contact our customer service team by email or phone."
Exchange Policy:
"Exchanges are available for defective products or if you change your mind within 30 days of purchase."

Shipping & Delivery Information
Shipping Methods:
"We offer free standard shipping on orders over $50. Expedited shipping options are also available."
Delivery Time:
"Standard delivery takes 5-7 business days. Expedited shipping arrives within 2-3 business days."
International Shipping:
"We offer international shipping to select countries. Please check our shipping page for more details on your region."
Shipping Fees:
"Standard shipping is $5.99. Expedited shipping costs $15.99 for the first item, and $5.00 for each additional item."

Location & Hours
Business Location:
"We are located at 123 Business St., City, Country."
Office Hours:
"Our store is open Monday through Friday, from 9 AM to 6 PM. We are closed on weekends and public holidays."
Holiday Hours:
"We will be closed on December 25th for Christmas and January 1st for New Year's Day."
Multiple Locations:
"We have three locations:
123 Business St., City, Country (Main Store)
456 Retail Ave., Suburb, Country (Branch A)
789 Market Rd., Town, Country (Branch B)"

Product & Service Information
Product Offerings:
"We sell electronics, including smartphones, laptops, and accessories. We also offer home appliances such as refrigerators, washing machines, and more."
Services Offered:
"In addition to selling products, we offer repair services for smartphones and laptops, as well as product setup and installation for home appliances."
Product Features:
"Our premium laptop comes with a 15.6-inch screen, Intel i7 processor, 16GB RAM, and a 512GB SSD."

Payment Methods
Accepted Payment Methods:
"We accept Visa, MasterCard, American Express, PayPal, and Apple Pay."
Payment Plan Options:
"We offer a 6-month payment plan with 0% interest for orders over $200."

Loyalty Programs & Discounts
Loyalty Program:
"Join our loyalty program and earn 1 point for every $1 spent. Collect 100 points and receive a $10 discount on your next purchase."
Current Promotions:
"Get 20% off your first order when you sign up for our newsletter. Use code NEW20 at checkout."
Student Discount:
"We offer a 10% discount for students. Please email us your student ID to receive your discount code."

FAQs (Frequently Asked Questions)
What is your refund policy?
"Refunds are issued to the original payment method. Please allow 7-10 business days for processing."
How do I cancel my order?
"To cancel your order, please contact customer support within 24 hours of purchase."
Do you offer gift cards?
"Yes, we offer digital and physical gift cards in denominations of $25, $50, and $100."

Account & Privacy Information
Account Creation:
"To create an account, click on the 'Sign Up' button at the top of the page and provide your name, email address, and a password."
Password Reset:
"If you forgot your password, go to the 'Forgot Password' section on the login page, and we will send you a reset link."
Privacy Policy:
"Your privacy is important to us. We do not share your personal information with third parties without your consent. Please refer to our privacy policy for more details."

Support & Helpdesk Information
Customer Support Contact:
"If you need help, you can contact our customer support team at support@company.com or call +1-555-1234."
Help Center:
"Visit our Help Center at www.company.com/help for answers to common questions and troubleshooting guides."
Live Chat:
"For immediate assistance, you can chat with our support team by clicking the live chat button on our website."

Legal Information
Terms and Conditions:
"By using our website and services, you agree to our Terms and Conditions. Please review them carefully before making any purchases."
Privacy Policy:
"Your privacy matters to us. Please read our Privacy Policy for information on how we collect and protect your data."`;

const API_KEY = "AIzaSyA8GaBf-smt7SfdFNkzUFvlshnRNZYy_hA";

// const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: chatInfo,
});

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
      document
        .querySelector(".chatbot-segment .chat-section")
        .insertAdjacentHTML(
          "beforeend",
          `
          <div class="chat-loader"></div>`
        );

      const chat = model.startChat(messages);

      let result = await chat.sendMessageStream("userMessage");

      document
        .querySelector(".chatbot-segment .chat-section")
        .insertAdjacentHTML(
          "beforeend",
          `
          <div class="model">
            <p></p>
          </div>`
        );

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        let modelMessages = document.querySelectorAll(
          ".chatbot-segment .chat-section"
        );
        modelMessages[modelMessages.length - 1]
          .querySelector("p")
          .insertAdjacentHTML("beforeend", `${chunkText}`);
      }

      // let result = await chat.sendMessage(userMessage);
      // document.querySelector(".chatbot-segment .chat-section").insertAdjacentHTML(
      //     "beforeend",
      //     `
      //   <div class="model">
      //     <p>${result.response.text()}</p>
      //   </div>`
      //   );

      // // UPDATING THE HISTORY
      // messages.history.push({
      //   role: "user",
      //   parts: [{ text: userMessage }],
      // });

      // messages.history.push({
      //   role: "model",
      //   parts: [{ text: result.response.text() }],
      // });
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
    // Loader timing section
    document
      .querySelector(".chatbot-segment .chat-section .chat-loader")
      .remove();
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
