/**
 * sourced: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
 * @param text
 */
export function copyTextToClipboard(text: string): boolean {
  let textArea = document.createElement("textarea");

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = "2em";
  textArea.style.height = "2em";

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = "0";

  // Clean up any borders.
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = "transparent";

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let successful: boolean;
  try {
    successful = document.execCommand("copy");
  } catch (err) {
    return false;
  }

  document.body.removeChild(textArea);
  return successful;
}
