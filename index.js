function sendMessage(){
    const userMessage = document.querySelector(".chatbot-segment input").value;
    if (userMessage.lenght){
        document.querySelector(".chatbot-segment input").value = ""
        document.querySelector(".chatbot-segment .chat-section").insertAdjacentHTML("beforeend",`
        <div class="chat-sender">
          <p>${userMessage}</p>
        </div>`)
    }
   
}
document.querySelector(".chatbot-segment .send-button").addEventListener("click",()=>sendMessage());
