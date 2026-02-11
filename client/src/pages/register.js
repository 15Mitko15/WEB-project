import { authService } from "../services/auth-service.js";
import { createAsyncAction } from "../hooks/async.js";
import { Button } from "../components/button.js";
import { Input } from "../components/input.js";
import { Card } from "../components/card.js";
import { showMessage } from "../utils/show-message.js";
import { setLoading } from "../utils/set-loading.js";

export function renderRegisterPage(rootEl) {
  rootEl.innerHTML = `<div class="container"><div id="slot" class="stack"></div></div>`;
  const slot = rootEl.querySelector("#slot");

  // Inputs
  const { element: firstNameField, input: firstNameInput } = Input({
    label: "First name",
    name: "firstName",
    type: "text",
  });

  const { element: lastNameField, input: lastNameInput } = Input({
    label: "Last name",
    name: "lastName",
    type: "text",
  });

  const { element: fnField, input: fnInput } = Input({
    label: "FN",
    name: "fn",
    type: "text",
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

  const message = document.createElement("div");
  message.className = "message message--error";
  message.style.display = "none";
  message.id = "out";

  const form = document.createElement("form");
  form.className = "stack";
  form.append(firstNameField, lastNameField, fnField, emailField, passField);

  const actions = document.createElement("div");
  actions.className = "row";

  const submitBtn = Button({
    label: "Register",
    variant: "primary",
    type: "submit",
  });

  if (!submitBtn.dataset.originalLabel) {
    submitBtn.dataset.originalLabel = submitBtn.textContent || "Register";
  }

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

  slot.append(card, message);

  const registerAction = createAsyncAction(
    async ({ firstName, lastName, fn, email, password }) => {
      const name = `${firstName} ${lastName}`.trim();
      return await authService.register({ name, fn, email, password });
    }
  );

  const unsubscribe = registerAction.subscribe((s) => {
    if (s.status === "loading") {
      setLoading(submitBtn, true, "Logging in...");
      return;
    }

    if (s.status === "error") {
      setLoading(submitBtn, false);
      showMessage(message, s.error?.message || "Registration failed");
      return;
    }

    if (s.status === "success") {
      setLoading(submitBtn, false);
      window.location.hash = "#/";
      return;
    }

    setLoading(submitBtn, false);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = String(firstNameInput.value || "").trim();
    const lastName = String(lastNameInput.value || "").trim();
    const fn = String(fnInput.value || "").trim();
    const email = String(emailInput.value || "").trim();
    const password = String(passInput.value || "");

    const missing = [];
    if (!firstName) missing.push("first name");
    if (!lastName) missing.push("last name");
    if (!fn) missing.push("fn");
    if (!email) missing.push("email");
    if (!password) missing.push("password");

    if (missing.length) {
      showMessage(message, `Please enter ${missing.join(", ")}.`);
      return;
    }

    await registerAction.run({ firstName, lastName, fn, email, password });
  });

  return () => unsubscribe();
}
