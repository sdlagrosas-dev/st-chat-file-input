import { Streamlit, RenderData } from "streamlit-component-lib"

// Create a style element
const style = document.createElement('style');

// Define the CSS class with the common border and borderRadius styles
style.textContent = `
  .common-border-style {
    border: 1px solid rgba(1, 0, 0, 0.5);
    border-radius: 7px;
  }

  .common-border-style:focused,
  .common-border-style:active {
    // border: 1px solid red;
    // border-radius: 7px;
    border-color: red;
  }
  .disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .error-message {
    color: rgb(125, 53, 59);
    padding: 15px 15px 15px 15px;
    background-color: rgb(255, 236, 236);
    border-radius: 8px;
    width: 100%;
  }
`;

// Append the style element to the document head
document.head.appendChild(style);

// Create a container for the chat input and file upload elements
const container = document.body.appendChild(document.createElement("div"))
container.style.display = "flex"
container.style.flexDirection = "column" // Stack children vertically
container.style.alignItems = "flex-start"

// Create a form element
const form = container.appendChild(document.createElement("form"))
form.style.display = "flex"
form.style.flexDirection = "column" // Stack children vertically
form.style.width = "100%"
form.style.alignItems = "flex-end"
form.style.flexGrow = "1"


// Create a div for the first row (previewContainer)
const firstRow = form.appendChild(document.createElement("div"))
firstRow.style.width = "100%"

// Create a div for file previews
const previewContainer = firstRow.appendChild(document.createElement("div"))
previewContainer.style.marginTop = "0.3rem" // Use rem units
// previewContainer.style.paddingBottom = "1px" // Use rem units
previewContainer.style.paddingLeft = "0.3rem" // Use rem units
previewContainer.style.maxHeight = "2rem" // Use rem units
previewContainer.style.overflowY = "auto"  // Enable vertical scrolling

// Variable to store the selected files
let selectedFiles: File[] = []

// Create a div for the second row (fileInputContainer, textArea, submitButton)
const secondRow = form.appendChild(document.createElement("div"))
secondRow.style.display = "flex"
secondRow.style.width = "100%"
secondRow.style.alignItems = "flex-start"
// secondRow.style.height = "80px"

// Create a div to hold the file input and the clip image button
const fileInputContainer = secondRow.appendChild(document.createElement("div"))
fileInputContainer.style.display = "inline-block"
fileInputContainer.style.position = "relative"
fileInputContainer.style.marginRight = "20px"
fileInputContainer.style.flexGrow = "0.05" // Flex grow for 5% width
fileInputContainer.style.top = "10%"

// Add a hidden file input for file uploads
const fileInput = fileInputContainer.appendChild(document.createElement("input"))
fileInput.type = "file"
fileInput.multiple = true
fileInput.style.display = "none"

// Add a clip image button for file uploads
const fileButton = fileInputContainer.appendChild(document.createElement("img"))
fileButton.src = "paper-clip.svg" // The path should correctly reference the public folder
fileButton.alt = "Attach files"
fileButton.style.width = "20px"
fileButton.style.height = "20px"
fileButton.style.cursor = "pointer"
fileButton.style.position = "absolute"
fileButton.style.top = "60%"
fileButton.style.left = "50%"
fileButton.style.right = "50%"
fileButton.draggable = false
// fileButton.style.translate = "translate(-50%, -50%)"

// Click handler for the clip image button to trigger the file input click
fileButton.onclick = function(): void {
  fileInput.click()
}

// Create a wrapper div for the textarea and the tooltip
const textAreaWrapper = secondRow.appendChild(document.createElement("div"));
textAreaWrapper.style.position = "relative"; // To position the tooltip within this wrapper
textAreaWrapper.style.flexGrow = "1"; // Ensure it grows to fill available space

// Add text area for chat messages
const textArea = textAreaWrapper.appendChild(document.createElement("textarea"));
textArea.placeholder = "Type your message here";
textArea.style.paddingLeft = "7px";
textArea.style.paddingRight = "5px";
textArea.style.marginRight = "5px";
textArea.style.height = "50px";
textArea.style.width = "100%"; // Ensure it fills the wrapper
textArea.style.resize = "none"; // Disable resizable property
textArea.classList.add('common-border-style');

// Handle dragging files over the text area
textArea.addEventListener("dragover", (event) => {
  if (textArea.disabled) {
    event.preventDefault(); // Prevent the drop action
    return;
  }
  event.preventDefault(); // Prevent default behavior to allow drop
  textArea.style.borderColor = "red"; // Optional: Add visual feedback for dragover
  // textArea.placeholder = "Drop to attach files";
});


// Add tooltip span element
const textAreaTooltip = textAreaWrapper.appendChild(document.createElement("span"));
textAreaTooltip.textContent = "Ctrl+Enter to send";
textAreaTooltip.style.position = "absolute";
textAreaTooltip.style.right = "2%";
textAreaTooltip.style.bottom = "1%";
textAreaTooltip.style.padding = "5px";
textAreaTooltip.style.color = "rgba(0, 0, 0, 0.5)";
textAreaTooltip.style.userSelect = "none"; // Disable text selection highlighting


// Create a div to hold the file input and the clip image button
const submitButtonContainer = secondRow.appendChild(document.createElement("div"))
submitButtonContainer.style.display = "inline-block"
submitButtonContainer.style.position = "relative"
submitButtonContainer.style.marginRight = "25px"
submitButtonContainer.style.flexGrow = "0.05" // Flex grow for 5% width
submitButtonContainer.style.top = "10%"

// Add a hidden file input for file uploads
const submitButton = submitButtonContainer.appendChild(document.createElement("button"))
submitButton.type = "button" // Prevent form submission on button click
submitButton.style.display = "none"


// Add a clip image button for file uploads
const submitImageButton = submitButtonContainer.appendChild(document.createElement("img"))
submitImageButton.src = "send-text.svg" // The path should correctly reference the public folder
submitImageButton.alt = "Send"
submitImageButton.style.width = "20px"
submitImageButton.style.height = "20px"
submitImageButton.style.cursor = "pointer"
submitImageButton.style.position = "absolute"
submitImageButton.style.top = "70%"
submitImageButton.style.left = "50%"
submitImageButton.style.right = "50%"
submitImageButton.draggable = false


// Click handler for the clip image button to trigger the file input click
submitImageButton.onclick = function(): void {
  submitButton.click()
}


// Function to update the file preview
function updateFilePreview(): void {
  previewContainer.innerHTML = ""

  if (selectedFiles.length > 0) {
    if (container.scrollHeight <= 130) {
      container.style.height = `${container.scrollHeight + 20}px` //"120px"
    }
    firstRow.style.height = "2rem"; // Use rem units
    firstRow.style.marginBottom = "0.5rem"; // Use rem units
  } else {
    container.style.height = "130px"
    firstRow.style.height = "1rem"; // Use rem units
    firstRow.style.marginBottom = "0"; // Use rem units
  }

  selectedFiles.forEach((file, index) => {
    const filePreview = document.createElement("div")
    filePreview.style.alignItems = "center"
    filePreview.style.marginBottom = "0.5rem" // Use rem units

    const removeButton = document.createElement("button")
    const removeImage = document.createElement("img")
    removeImage.src = "delete-button.svg"
    removeImage.alt = "Remove file"
    removeImage.style.width = "1rem" // Use rem units
    removeImage.style.height = "1rem" // Use rem units
    removeImage.style.cursor = "pointer"
    removeImage.draggable = false
    removeButton.appendChild(removeImage)
    removeButton.onclick = () => {
      selectedFiles.splice(index, 1)
      updateFilePreview()
    }
    removeButton.style.background = "none"
    removeButton.style.border = "none"
    removeButton.style.cursor = "pointer"
    removeButton.draggable = false

    const fileName = document.createElement("span")
    fileName.textContent = file.name
    fileName.style.flexGrow = "1"

    filePreview.appendChild(removeButton)
    filePreview.appendChild(fileName)

    previewContainer.appendChild(filePreview)
  })

  // Update the container height if files are selected
  if (selectedFiles.length > 0) {
    previewContainer.style.height = "2rem" // Use rem units
  } else {
    previewContainer.style.height = "0" // Use rem units
  }

  setFrameHeight();
}

// Add keydown handler to the text area to handle ctrl+enter submission
textArea.onkeydown = function(event: KeyboardEvent): void {
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault()
    submitForm()
  }
}

// Add click handler to the submit button to send data back to Streamlit
submitButton.onclick = function(): void {
  submitForm()
}

// Function to submit the form
function submitForm(): void {
  const message = textArea.value

  if (selectedFiles.length > 0) {
    const fileReaders = selectedFiles.map(file => {
      return new Promise<{ name: string, data: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function(event) {
          const target = event.target as FileReader
          if (target && target.result) {
            resolve({ name: file.name, data: target.result as string })
          } else {
            reject(new Error("File reading failed"))
          }
        }
        reader.onerror = function() {
          reject(new Error("File reading failed"))
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(fileReaders).then(files_data => {
      Streamlit.setComponentValue({ message, files_data })
    }).catch(error => {
      console.error("Error reading files", error)
      Streamlit.setComponentValue({ message, files_data: [] })
    })
    
  } else {
    // Send only the message if no files are selected
    Streamlit.setComponentValue({ message, files_data: [] })
  }

  resetForm()
}

function resetForm(): void {
  // Clear the text area
  textArea.value = "";

  // Clear selected files
  selectedFiles = [];
  updateFilePreview();

  // Clear file input
  fileInput.value = "";

}

function setFrameHeight(): void {
  Streamlit.setFrameHeight(container.scrollHeight);
}

function createErrorSpan(message: string): HTMLSpanElement {
  const existingSpan = document.querySelector(".error-message") as HTMLSpanElement;
  if (existingSpan) {
    existingSpan.textContent = message; // Update content of existing span
    return existingSpan;
  } else {
    const errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message"); // Add a CSS class for styling
    errorSpan.textContent = message;
    return errorSpan;
  }
}

function handleFileInput(acceptedFiles: File[]): void {
  // Update selectedFiles and handle accepted files only
  if (acceptedFiles.length > 0) {
    selectedFiles = [...selectedFiles, ...acceptedFiles];
    updateFilePreview();
    // Clear any rejected files from the input value
    fileInput.value = '';
    // Remove any existing error spans
    const existingSpans = container.querySelectorAll(".error-message");
    if (existingSpans) {
      existingSpans.forEach(span => span.remove());
    }
  } else {
    // Handle rejected files (optional: display error message)
    const errorSpan = createErrorSpan("Unsupported file format(s)!");
    container.insertBefore(errorSpan, form);
    console.warn("Unsupported file format(s)!");
  }
}
/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  // Get the RenderData from the event
  const data = (event as CustomEvent<RenderData>).detail

  // Clear input fields if needed
  fileInput.value = ""

  // Get the file_formats parameter
  const fileFormats = data.args["file_formats"] || [];
  // console.log("fileFormats: ", fileFormats)

  fileInput.onchange = function(): void {

    // Store the current value of the text area
    const currentTextAreaValue = textArea.value;

    console.log("currentTextAreaValue: ", currentTextAreaValue);

    if (fileInput.files) {
      const acceptedFiles = [];
      for (const file of Array.from(fileInput.files)) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (fileExtension && fileFormats.includes(fileExtension)) {
          acceptedFiles.push(file);
        }
      }
      handleFileInput(acceptedFiles);
      
    }

    console.log("currentTextAreaValue after handleFileInput: ", currentTextAreaValue);
    // Restore the text area value
    textArea.value = currentTextAreaValue;

  };

  if (data.args["disabled"]) {
    fileButton.style.display = "none"
    fileInput.disabled = true
    textArea.disabled = true
    textArea.classList.add('disabled')
    submitImageButton.style.display = "none"
    submitButton.disabled = true
  } else {
    fileButton.style.display = "block"
    fileInput.disabled = false
    textArea.disabled = false
    textArea.classList.remove('disabled')
    submitImageButton.style.display = "block"
    submitButton.disabled = false
  }


  // Maintain compatibility with older versions of Streamlit that don't send
  // a theme object.
  if (data.theme) {
    const borderStyling = `1px solid var(${data.disabled ? "--primary-color" : "gray"})`
    submitButton.style.border = borderStyling
    submitButton.style.outline = borderStyling
  }

  // RenderData.args is the JSON dictionary of arguments sent from the
  // Python script.
  let placeholder = data.args["placeholder"]

  // Update the placeholder text with the provided placeholder
  textArea.placeholder = `${placeholder}`

  updateFilePreview()
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady()
