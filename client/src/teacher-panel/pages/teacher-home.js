export function renderTeacherHome(rootEl) {
  rootEl.innerHTML = `
      <div class="container">
        <div class="stack">
          <header class="teacher-hero">
            <h1 class="teacher-title">Teacher dashboard</h1>
            <p class="teacher-subtitle">Quick actions for managing presenting slots and events.</p>
          </header>
  
          <section class="teacher-grid" aria-label="Teacher actions">
            <a class="teacher-card" href="#/teacher/slot/add">
              <div class="teacher-card__title">Add a slot</div>
              <div class="teacher-card__desc">Create a new presenting slot.</div>
              <div class="teacher-card__cta">Go →</div>
            </a>
  
            <a class="teacher-card" href="#/teacher/slots">
              <div class="teacher-card__title">View open slots</div>
              <div class="teacher-card__desc">See all available slots and their status.</div>
              <div class="teacher-card__cta">Go →</div>
            </a>
  
            <a class="teacher-card" href="#/teacher/events">
              <div class="teacher-card__title">View current events</div>
              <div class="teacher-card__desc">Browse the events that are currently published.</div>
              <div class="teacher-card__cta">Go →</div>
            </a>
  
            <a class="teacher-card teacher-card--danger" href="#/">
              <div class="teacher-card__title">Leave teacher view</div>
              <div class="teacher-card__desc">Back to the normal user homepage.</div>
              <div class="teacher-card__cta">Exit →</div>
            </a>
          </section>
        </div>
      </div>
    `;

  return () => {};
}
