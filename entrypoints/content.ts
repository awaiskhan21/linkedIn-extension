import Frame from "../assets/Frame.svg";
export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    console.log("Hello content.");
    document.addEventListener("click", (e) => {
      try {
        const inputBox = e.target as HTMLInputElement;
        if (inputBox.matches(".msg-form__contenteditable")) {
          console.log("Clicked on", e.target);
          alert("Clicked on input box");

          // If the edit icon hasn't been added yet, inject it
          if (inputBox && !inputBox.querySelector(".edit-icon")) {
            console.log("");
            inputBox.style.position = "relative";

            const btn = document.createElement("img");
            btn.className = "edit-btn";
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
          }
        }
      } catch (error) {
        console.error("Error", error);
      }
    });
  },
});
