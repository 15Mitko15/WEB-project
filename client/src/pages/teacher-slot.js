export function renderTeacherSlotPage(rootEl) {
  rootEl.innerHTML = `
      <div class="container">
        <h1>Add presenting slot</h1>
        <p class="muted">Only teachers can access this page.</p>
  
        <!-- Your form/UI goes here -->
        <div class="card">
          <div class="card__header">
            <h2 style="margin:0; font-size:1.1rem">New Slot</h2>
          </div>
          <div class="card__body">
            <p>TODO: build the form</p>
          </div>
        </div>
      </div>
    `;

  return () => {
    // cleanup listeners here later if you add any
  };
}
