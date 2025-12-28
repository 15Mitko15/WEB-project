export function renderHome(container) {
  container.innerHTML = `
      <h1>Frontend is running 🚀</h1>
      <button id="test-api">Test API</button>
      <pre id="output"></pre>
    `;

  const button = document.getElementById("test-api");
  button.addEventListener("click", () => {
    console.log("Button clicked");
  });
}
