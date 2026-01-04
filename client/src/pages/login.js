import { authService } from "../services/auth-service.js";
import { Button } from "../components/button.js";
import { Input } from "../components/input.js";
import { Card } from "../components/card.js";
import { showMessage } from "../utils/show-message.js";
import { setLoading } from "../utils/set-loading.js";

export function renderLoginPage(rootEl) {
  rootEl.innerHTML = `<div class="container"><div id="slot" class="stack"></div></div>`;
  const slot = rootEl.querySelector("#slot");

  // Build inputs
  const { element: emailField, input: emailInput } = Input({
    label: "Email",
    name: "email",
    type: "email",
  });

  const { element: passField, input: passInput } = Input({
    label: "Password",
    name: "password",
    type: "password",
  });

  // Message area
  const error = document.createElement("div");
  error.className = "message message--error";
  error.style.display = "none"; // hidden until used
  error.id = "out";

  // Form
  const form = document.createElement("form");
  form.className = "stack";
  form.append(emailField, passField);

  const actions = document.createElement("div");
  actions.className = "row";

  const submitBtn = Button({
    label: "Login",
    variant: "primary",
    type: "submit",
  });

  const registerLink = document.createElement("a");
  registerLink.href = "#/register";
  registerLink.textContent = "Register";
  registerLink.style.color = "var(--muted)";

  actions.append(submitBtn, registerLink);
  form.append(actions);

  const card = Card({
    title: "Login",
    body: form,
  });

  slot.append(card, error);

  // submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = String(emailInput.value || "").trim();
    const password = String(passInput.value || "");

    const missingFields = [];

    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      showMessage(error, `Please enter ${missingFields.join(" and ")}.`);
      return;
    }

    setLoading(submitBtn, true);
    showMessage(error, "Logging in...", { muted: true });

    try {
      await authService.login(email, password);
      window.location.hash = "#/";
    } catch (err) {
      showMessage(error, err?.message || "Wrong email or password");
      setLoading(submitBtn, false);
    }
  });
}
