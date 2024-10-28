import Frame from "../assets/Frame.svg";
import insert from "../assets/insert.svg";
import regenerate from "../assets/regenerate.svg";
import generate from "../assets/send.svg";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    console.log("Hello content.");

    //flag to track if the event listener is added
    let generateBtnAdded = false;

    document.addEventListener("click", (e) => {
      const inputBox = e.target as HTMLInputElement;
      const popUpDiv = `
          <div id="popup-div" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 4000;">
            <div id="popup-div-container" style="background: white; border-radius: 8px; width: 100%; max-width: 570px; padding: 20px;">
              <div id="messages" style="margin-top: 10px; max-height: 200px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column;"></div>
              <div style="margin-bottom: 10px;">
                <input id="input-text" type="text" placeholder="Enter your prompt..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"/>
              </div>
              <div style="text-align: right; margin-top: 12px;">
                <button id="insert-btn" style="background: #fff; color: #666D80; padding: 8px 16px; border: 2px solid #666D80; border-radius: 4px; cursor: pointer; display: none; margin-right: 10px;">
                  <img src="${insert}" alt="Insert" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px;"> 
                  <b>Insert</b>
                </button>
                <button id="generate-btn" style="background: #007bff; color: white; padding: 8px 16px; border: 2px solid #007bff; border-radius: 4px; cursor: pointer;">
                  <img src="${generate}" alt="Generate" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px"> 
                  <b>Generate</b>
                </button>
              </div>
            </div>
          </div>`;

      if (!document.getElementById("popup-div")) {
        document.body.insertAdjacentHTML("beforeend", popUpDiv);
      }

      const popup = document.getElementById("popup-div") as HTMLDivElement;
      const messagesDiv = document.getElementById("messages") as HTMLDivElement;
      const inputText = document.getElementById(
        "input-text"
      ) as HTMLInputElement;
      const generateBtn = document.getElementById(
        "generate-btn"
      ) as HTMLButtonElement;
      const insertBtn = document.getElementById(
        "insert-btn"
      ) as HTMLButtonElement;
      const msg =
        "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
      if (inputBox.matches(".msg-form__contenteditable")) {
        console.log("Clicked on", e.target);

        if (inputBox && !inputBox.querySelector(".msg-btn")) {
          inputBox.style.position = "relative";

          const btn = document.createElement("img");
          btn.className = "msg-btn";
          btn.src = Frame;
          btn.alt = "Custom btn";
          btn.style.position = "absolute";
          btn.style.bottom = "5px";
          btn.style.right = "5px";
          btn.style.width = "30px";
          btn.style.height = "30px";
          btn.style.cursor = "pointer";
          btn.style.zIndex = "1000";
          inputBox.appendChild(btn);

          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            popup.style.display = "flex";
          });
        }
      }

      // Add event listener to generate button only once
      if (generateBtn && !generateBtnAdded) {
        generateBtn.addEventListener("click", (e) => {
          e.stopPropagation();

          const inputValue = inputText.value.trim();
          if (!inputValue) return;

          // Display the user's message in the messages div
          const userMessageDiv = document.createElement("div");
          userMessageDiv.textContent = inputValue;
          Object.assign(userMessageDiv.style, {
            backgroundColor: "#DFE1E7",
            color: "#666D80",
            borderRadius: "12px",
            padding: "10px",
            marginBottom: "5px",
            textAlign: "right",
            maxWidth: "80%",
            alignSelf: "flex-end",
            marginLeft: "auto",
          });
          messagesDiv.appendChild(userMessageDiv);

          // Disable the generate button and show loading state
          generateBtn.disabled = true;
          generateBtn.textContent = "Loading...";
          generateBtn.style.backgroundColor = "#666D80";

          const generatedMessageDiv = document.createElement("div");
          generatedMessageDiv.textContent = msg;
          Object.assign(generatedMessageDiv.style, {
            backgroundColor: "#DBEAFE",
            color: "#666D80",
            borderRadius: "12px",
            padding: "10px",
            marginBottom: "5px",
            textAlign: "left",
            maxWidth: "80%",
            alignSelf: "flex-start",
            marginRight: "auto",
          });

          // Add generated message to the messages div
          messagesDiv.appendChild(generatedMessageDiv);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;

          generateBtn.disabled = false;
          generateBtn.style.backgroundColor = "#007bff";
          generateBtn.style.color = "white";
          generateBtn.innerHTML = `<img src="${regenerate}" alt="Regenerate" style="vertical-align: middle; margin-right: 5px; width: 16px; height: 16px"> <b>Regenerate</b>`;

          inputText.value = "";
          insertBtn.style.display = "inline-block";
        });

        generateBtnAdded = true; //flag to prevent duplicate listeners
      }
      insertBtn.addEventListener("click", () => {
        // Find or create a <p> tag inside the contenteditable area
        let existingParagraph = inputBox.querySelector("p");

        if (!existingParagraph) {
          existingParagraph = document.createElement("p");
          inputBox.appendChild(existingParagraph);
        }

        // Clear and insert the new message
        existingParagraph.textContent = msg;

        // Hide the insert button and close the popup
        insertBtn.style.display = "none";
        popup.style.display = "none";
      });
      document.addEventListener("click", (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (
          popup.style.display === "flex" &&
          !popup.contains(target) &&
          !target.classList.contains("edit-icon")
        ) {
          popup.style.display = "none";
        }
      });
    });
  },
});
