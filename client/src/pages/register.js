import { authService } from "../services/auth-service.js";
import { Button } from "../components/button.js";
import { Input } from "../components/input.js";
import { Card } from "../components/card.js";
import { showMessage } from "../utils/show-message.js";
import { setLoading } from "../utils/set-loading.js";

export function renderRegisterPage(rootEl) {
  rootEl.innerHTML = `<div class="container"><div id="slot" class="stack"></div></div>`;
  const slot = rootEl.querySelector("#slot");

  // Build inputs
  const { element: nameField, input: nameInput } = Input({
    label: "Full Name",
    name: "fullname",
  });

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
  error.style.display = "none";
  error.id = "out";

  // Form
  const form = document.createElement("form");
  form.className = "stack";
  form.append(nameField, emailField, passField);

  const actions = document.createElement("div");
  actions.className = "row";

  const submitBtn = Button({
    label: "Register",
    variant: "primary",
    type: "submit",
  });

  const loginLink = document.createElement("a");
  loginLink.href = "#/login";
  loginLink.textContent = "Login";
  loginLink.style.color = "var(--muted)";

  actions.append(submitBtn, loginLink);
  form.append(actions);

  const card = Card({
    title: "Register",
    body: form,
  });

  slot.append(card, error);

  // submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = String(nameInput.value || "").trim();
    const email = String(emailInput.value || "").trim();
    const password = String(passInput.value || "");

    const missingFields = [];
    if (!username) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      showMessage(
        error,
        `Please enter ${missingFields
          .join(", ")
          .replace(/, ([^,]*)$/, " and $1")}.`
      );
      return;
    }

    setLoading(submitBtn, true);
    showMessage(error, "Registering...", { muted: true });

    try {
      await authService.register({ username, email, password });
      window.location.hash = "/";
    } catch (err) {
      showMessage(error, err?.message || "Registration failed");
      setLoading(submitBtn, false);
    }
  });
}
