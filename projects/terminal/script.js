const term = document.getElementById('terminal');
const body = document.body;

let history = [];
let historyIndex = -1;

const state = {
  score: 0,
  mode: 'portfolio',
  challengeIndex: 0,
  challenges: [
    {
      level: 'Easy SQL',
      question: 'Select all rows from table students',
      answer: /^select\s+\*\s+from\s+students;?$/i
    },
    {
      level: 'Medium SQL',
      question: 'Find highest salary from employees',
      answer: /^select\s+max\s*\(\s*salary\s*\)\s+from\s+employees;?$/i
    },
    {
      level: 'Hard SQL',
      question: 'Second highest salary from employees',
      answer: /salary\s*<\s*\(\s*select\s+max\s*\(\s*salary\s*\)/i
    }
  ]
};

const commands = {
  help() {
    return `
Commands:
help
about
projects
challenge
solve <answer>
score
theme
resume
mode <portfolio|assessment>
clear
`;
  },

  about() {
    return 'Computer Science student focused on SQL, logic, and clean systems.';
  },

  projects() {
    return `
<div class="card">
  <strong>Interactive Terminal Portfolio</strong><br/>
  SQL Challenges · Typing Engine · Scoring System
</div>`;
  },

  challenge() {
    const c = state.challenges[state.challengeIndex];
    return `
<div class="card">
  <strong>${c.level}</strong><br/>
  ${c.question}
</div>`;
  },

  solve(input) {
    const c = state.challenges[state.challengeIndex];
    if (c.answer.test(input)) {
      state.score += 10;
      state.challengeIndex = Math.min(
        state.challengeIndex + 1,
        state.challenges.length - 1
      );
      return `<span class="success">Correct ✔ Score: ${state.score}</span>`;
    }
    return `<span class="error">Incorrect ✖ Try again</span>`;
  },

  score() {
    return `Current Score: ${state.score}`;
  },

  theme() {
    body.dataset.theme =
      body.dataset.theme === 'dark' ? 'light' : 'dark';
    return `Theme switched to ${body.dataset.theme}`;
  },

  resume() {
    // GitHub Pages safe PDF open
    window.open('./resume.pdf', '_blank');
    return 'Opening resume...';
  },

  mode(arg) {
    state.mode = arg || 'portfolio';
    return `Mode set to ${state.mode}`;
  },

  clear() {
    term.innerHTML = '';
    return '';
  }
};

function print(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  term.appendChild(div);
  term.scrollTop = term.scrollHeight;
}

function prompt() {
  const line = document.createElement('div');
  line.className = 'cmdline';

  const label = document.createElement('span');
  label.className = 'prompt';
  label.textContent = 'student@local:$';

  const input = document.createElement('input');
  input.autocomplete = 'off';

  line.appendChild(label);
  line.appendChild(input);
  term.appendChild(line);
  input.focus();

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex] || '';
    }

    if (e.key === 'ArrowDown') {
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || '';
    }

    if (e.key === 'Enter') {
      const value = input.value.trim();
      history.push(value);
      historyIndex = history.length;
      input.disabled = true;
      handle(value);
    }
  });
}

function handle(text) {
  if (!text) return prompt();

  const [cmd, ...rest] = text.split(' ');
  const arg = rest.join(' ');

  if (commands[cmd]) {
    print(commands[cmd](arg));
  } else {
    print(`<span class="error">Command not found</span>`);
  }

  prompt();
}

function typeText(text, speed = 15) {
  return new Promise(resolve => {
    let i = 0;
    const span = document.createElement('span');
    term.appendChild(span);

    const timer = setInterval(() => {
      span.textContent += text[i++] || '';
      term.scrollTop = term.scrollHeight;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

async function boot() {
  await typeText("(!) Welcome to behindTheScenes' terminal (!) v1.0\n");
  await typeText("Loading portfolio modules...\n");
  await typeText("Type 'help' to get started.\n\n");
  prompt();
}

boot();
