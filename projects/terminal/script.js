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
      answer: /^select\s+max\(salary\)\s+from\s+employees;?$/i
    },
    {
      level: 'Hard SQL',
      question: 'Second highest salary from employees',
      answer: /salary\s+<\s*\(select\s+max\(salary\)/i
    }
  ]
};

const commands = {
  help() {
    return `Commands:
help
about
projects
challenge
solve <answer>
score
theme
resume
type
mode <assessment|portfolio>
clear`;
  },

  about() {
    return 'Computer Science student focused on SQL, logic, and clean systems.';
  },

  projects() {
    return `<div class="card">Interactive Terminal Portfolio<br/>SQL Challenges · Typing Engine · Scoring</div>`;
  },

  challenge() {
    const c = state.challenges[state.challengeIndex];
    return `<div class="card"><strong>${c.level}</strong><br/>${c.question}</div>`;
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
    const a = document.createElement('a');
    a.href = 'resume.pdf';
    a.download = 'resume.pdf';
    a.click();
    return 'Downloading resume...';
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

function typeText(text, speed = 12) {
  return new Promise(resolve => {
    let i = 0;
    const span = document.createElement('span');
    term.appendChild(span);
    const timer = setInterval(() => {
      span.innerHTML += text[i++] || '';
      term.scrollTop = term.scrollHeight;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

function prompt() {
  const line = document.createElement('div');
  line.className = 'cmdline';
  line.innerHTML = `<span class="prompt">student@local:$</span>`;
  const input = document.createElement('input');
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

function print(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  term.appendChild(div);
}

function handle(text) {
  if (!text) return prompt();
  const [cmd, ...rest] = text.split(' ');
  const arg = rest.join(' ');
  if (commands[cmd]) print(commands[cmd](arg));
  else print(`<span class="error">Command not found</span>`);
  prompt();
}

async function boot() {
  await typeText("(!) Welcome to behindTheScenes' terminal (!) v1.0\n");
  await typeText('Loading portfolio modules...\n');
  await typeText('To begin, type help or hit enter key.\n\n');
  prompt();
}

boot();
