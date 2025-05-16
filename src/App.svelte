<script>
  let sessionMinutes = 25;
  let breakMinutes = 5;
  let longBreakMinutes = 15;
  let totalSessions = 4;
  let showSettings = false;

  let isRunning = false;
  let timeLeft = sessionMinutes * 60;
  let timer;
  let currentSession = 1;
  let isBreak = false;

  const alarmSound = new Audio('/ding.mp3');

  function playSound() {
    alarmSound.play();
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function toggleTimer() {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
    } else {
      isRunning = true;
      timer = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
        } else {
          clearInterval(timer);
          isRunning = false;
          playSound();
          nextPhase();
        }
      }, 1000);
    }
  }

  function nextPhase() {
    if (!isBreak) {
      if (currentSession < totalSessions) {
        isBreak = true;
        timeLeft = breakMinutes * 60;
      } else {
        isBreak = true;
        timeLeft = longBreakMinutes * 60;
        currentSession = 0;
      }
    } else {
      currentSession++;
      isBreak = false;
      timeLeft = sessionMinutes * 60;
    }
    toggleTimer();
  }

  function resetAll() {
    clearInterval(timer);
    isRunning = false;
    currentSession = 1;
    isBreak = false;
    timeLeft = sessionMinutes * 60;
  }

  function getProgress() {
    const totalTime = isBreak
      ? (currentSession === 0 ? longBreakMinutes : breakMinutes) * 60
      : sessionMinutes * 60;
    return 100 - (timeLeft / totalTime) * 100;
  }
  
  function toggleSettings() {
    showSettings = !showSettings;
  }
</script>

<main>
  <h1>Pomodoro Timer</h1>

  <div class="timer">
    <div class="progress-bar">
      <div class="progress-fill" style="width: {getProgress()}%;"></div>
    </div>

    <h2>{isBreak ? (currentSession === 0 ? 'Long Break' : 'Short Break') : `Session ${currentSession}`}</h2>

    <div class="time-display">{formatTime(timeLeft)}</div>

    <div class="controls">
      <button on:click={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
      <button on:click={resetAll}>Reset</button>
      <button on:click={toggleSettings} class="settings-button">{showSettings ? 'Hide Settings' : 'Settings'}</button>
    </div>
  </div>

  {#if showSettings}
    <div class="settings">
      <h3>Timer Settings</h3>
      <label>
        Session Length (minutes):
        <input type="number" bind:value={sessionMinutes} min="1" />
      </label>
      <label>
        Total Sessions:
        <input type="number" bind:value={totalSessions} min="1" />
      </label>
      <label>
        Short Break:
        <input type="number" bind:value={breakMinutes} min="1" />
      </label>
      <label>
        Long Break:
        <input type="number" bind:value={longBreakMinutes} min="1" />
      </label>
    </div>
  {/if}
</main>

<style>
  :root {
    --color-primary: #ff6f61;
    --color-secondary: #4ecdc4;
    --color-bg: #f0f4f8;
    --color-card-bg: #fff;
    --color-text-main: #222;
    --color-text-muted: #666;
    --shadow: rgba(0,0,0,0.1);
    --radius: 14px;
    --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    --transition: 0.3s ease;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: var(--color-bg);
    font-family: var(--font-family);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  main {
    background: var(--color-card-bg);
    border-radius: var(--radius);
    box-shadow: 0 8px 24px var(--shadow);
    width: 90vw;
    max-width: 440px;
    padding: 3rem 2.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2.25rem;
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-primary);
    user-select: none;
  }

  .timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.8rem;
  }

  .progress-bar {
    width: 100%;
    height: 12px;
    background: #d9e2ec;
    border-radius: 6px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-secondary);
    transition: width 0.3s ease-in-out;
  }

  h2 {
    margin: 0;
    color: var(--color-text-main);
    font-weight: 600;
    font-size: 1.6rem;
  }

  .time-display {
    font-size: 5rem;
    font-weight: 700;
    color: var(--color-primary);
    font-family: 'Fira Code', monospace;
    letter-spacing: -0.06em;
    user-select: none;
  }

  .controls {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  button {
    flex: 1 1 120px;
    padding: 0.85rem 1.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    border: none;
    border-radius: 12px;
    background: var(--color-primary);
    cursor: pointer;
    transition: background-color var(--transition), transform var(--transition);
    user-select: none;
  }

  button:hover {
    background: #e65a4d;
    transform: translateY(-2px);
  }

  button:active {
    transform: translateY(0);
  }

  button.settings-button {
    background: #a0a7b8;
  }

  button.settings-button:hover {
    background: #7c8497;
  }

  .settings {
    background: #f8fafc;
    border-radius: var(--radius);
    padding: 1.75rem 2rem;
    box-shadow: 0 4px 12px var(--shadow);
    text-align: left;
    display: grid;
    gap: 1.25rem;
  }

  label {
    font-weight: 500;
    font-size: 1rem;
    color: var(--color-text-muted);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input[type="number"] {
    padding: 0.7rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
    border: 1.5px solid #d0d7de;
    text-align: center;
    outline-offset: 2px;
    transition: border-color 0.3s ease;
  }

  input[type="number"]:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 5px var(--color-primary);
  }

  /* Responsive */
  @media (max-width: 600px) {
    main {
      padding: 2.5rem 2rem;
      width: 95vw;
    }
    .time-display {
      font-size: 4rem;
    }
    button {
      flex-basis: 100%;
    }
  }

  @media (max-width: 400px) {
    .time-display {
      font-size: 3.5rem;
    }
  }
</style>