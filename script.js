let currentInput = '0';
let formula = '';
let isResultShown = false;

let soundMode = 'meow';
let audioCtx = null;

const screenValue = document.getElementById('screenValue');
const screenFormula = document.getElementById('screenFormula');
const peekingCat = document.getElementById('peekingCat');
const cornerPaw = document.getElementById('cornerPaw');
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}
function synthMeow(pitchMultiplier = 1.0) {
    if (soundMode === 'mute') return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'triangle';

    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sawtooth';

    const osc2Gain = audioCtx.createGain();
    osc2Gain.gain.setValueAtTime(0.02, now);
    osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 3.5;
    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    mainGain.gain.linearRampToValueAtTime(0.15, now + 0.15);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    const baseFreq = 380 * pitchMultiplier;
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);
    osc1.frequency.linearRampToValueAtTime(baseFreq * 1.25, now + 0.35);

    osc2.frequency.setValueAtTime(baseFreq * 2, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 3, now + 0.12);
    osc2.frequency.linearRampToValueAtTime(baseFreq * 2.5, now + 0.35);
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.exponentialRampToValueAtTime(1600, now + 0.12);
    filter.frequency.linearRampToValueAtTime(800, now + 0.38);

    osc1.connect(filter);

    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);

    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.48);
    osc2.stop(now + 0.48);
}

function synthClick(frequency = 800) {
    if (soundMode === 'mute') return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
}
function synthSqueak() {
    if (soundMode === 'mute') return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(1000, now + 0.08);

    gainNode.gain.setValueAtTime(0.06, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
}
function playSound(type) {
    if (soundMode === 'mute') return;

    if (soundMode === 'click') {
        if (type === 'meow-result') {
            synthClick(1200);
        } else {
            synthClick(800);
        }
        return;
    }

    switch (type) {
        case 'meow-result':
            synthMeow(1.0);
            break;
        case 'meow-cat':
            synthMeow(1.2);
            break;
        case 'error':
            synthMeow(0.65);
            break;
        case 'operator':
            synthClick(1000);
            break;
        case 'click-squeak':
            synthSqueak();
            break;
        case 'button-press':
        default:
            synthClick(750);
            break;
    }
}

peekingCat.addEventListener('click', () => {
    peekingCat.classList.add('wink');
    playSound('meow-cat');

    spawnHeart();

    setTimeout(() => {
        peekingCat.classList.remove('wink');
    }, 150);
});

cornerPaw.addEventListener('click', () => {
    cornerPaw.style.transform = 'scale(0.85) rotate(-5deg)';
    playSound('click-squeak');

    const originalText = screenValue.textContent;
    screenValue.textContent = 'MEOW!';

    setTimeout(() => {
        cornerPaw.style.transform = '';
        screenValue.textContent = originalText;
    }, 400);
});

function spawnHeart() {
    const container = document.querySelector('.hearts-container');
    const heartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    heartSvg.setAttribute('viewBox', '0 0 16 16');
    heartSvg.setAttribute('width', '16');
    heartSvg.setAttribute('height', '16');
    heartSvg.classList.add('floating-heart');

    const randomX = Math.floor(Math.random() * 40) + 40;
    heartSvg.style.left = `${randomX}px`;
    heartSvg.style.top = '15px';
    heartSvg.style.zIndex = '9';

    heartSvg.innerHTML = `
        <path d="M 4 2 L 6 2 L 6 4 L 8 4 L 8 2 L 10 2 L 10 4 L 12 4 L 12 6 L 14 6 L 14 10 L 12 10 L 12 12 L 10 12 L 10 14 L 8 14 L 8 16 L 6 16 L 6 14 L 4 14 L 4 12 L 2 12 L 2 10 L 0 10 L 0 6 L 2 6 L 2 4 L 4 4 Z" fill="#5D4037"/>
        <path d="M 4 4 L 6 4 L 6 6 L 8 6 L 8 4 L 10 4 L 10 6 L 12 6 L 12 8 L 10 8 L 10 10 L 8 10 L 8 12 L 6 12 L 6 10 L 4 10 L 4 8 L 2 8 L 2 6 L 4 6 Z" fill="#FF5252"/>
    `;

    heartSvg.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-40px) scale(1.2) rotate(' + (Math.random() * 20 - 10) + 'deg)', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'ease-out'
    });

    container.appendChild(heartSvg);
    setTimeout(() => heartSvg.remove(), 1000);
}


function updateDisplay() {
    screenFormula.textContent = formula || ' ';

    const valLength = currentInput.length;
    if (valLength > 14) {
        screenValue.style.fontSize = '1.7rem';
    } else if (valLength > 10) {
        screenValue.style.fontSize = '2.1rem';
    } else {
        screenValue.style.fontSize = '2.8rem';
    }

    screenValue.textContent = currentInput;
}

function cleanResult(num) {
    if (isNaN(num)) return 'MEOW?';
    if (!isFinite(num)) return 'MEOW?';

    const result = parseFloat(num.toFixed(8));
    return result.toString();
}

function handleInput(key) {
    if (!isNaN(key) || key === '.') {
        playSound('button-press');
        if (isResultShown) {
            currentInput = '';
            isResultShown = false;
        }

        if (key === '.') {
            if (currentInput.includes('.')) return;
            if (currentInput === '') currentInput = '0';
        }

        if (currentInput === '0' && key !== '.') {
            currentInput = key;
        } else {
            if (currentInput.length >= 16) return;
            currentInput += key;
        }
    }
    else if (['+', '-', '*', '/'].includes(key)) {
        playSound('operator');

        if (isResultShown) {
            formula = currentInput + ' ' + formatOperatorSymbol(key) + ' ';
            isResultShown = false;
        } else {
            if (currentInput === '0' && formula !== '') {
                formula = formula.trim().replace(/[\+\-\×\÷]$/, formatOperatorSymbol(key)) + ' ';
            } else {
                formula += currentInput + ' ' + formatOperatorSymbol(key) + ' ';
            }
        }
        currentInput = '0';
    }
    else if (key === '%') {
        playSound('button-press');
        let val = parseFloat(currentInput);
        if (isNaN(val)) return;
        const match = formula.trim().match(/(\d+(?:\.\d+)?)\s*([\+\-\×\÷])\s*$/);
        if (match) {
            const baseVal = parseFloat(match[1]);
            const op = match[2];
            if (['+', '-'].includes(op)) {
                currentInput = cleanResult((baseVal * val) / 100);
            } else {
                currentInput = cleanResult(val / 100);
            }
        } else {
            currentInput = cleanResult(val / 100);
        }
        isResultShown = false;
    }
    else if (key === '=') {
        if (formula === '') {
            playSound('button-press');
            return;
        }

        const fullExpression = formula + currentInput;
        let evalExpression = fullExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        try {
            let result = eval(evalExpression);

            if (result === Infinity || result === -Infinity || isNaN(result)) {
                playSound('error');
                currentInput = 'MEOW?';
            } else {
                playSound('meow-result');
                currentInput = cleanResult(result);
            }
            formula = fullExpression + ' =';
            isResultShown = true;
        } catch (e) {
            playSound('error');
            currentInput = 'MEOW?';
            isResultShown = true;
        }
    }
    else if (key === 'backspace') {
        playSound('button-press');
        if (isResultShown) {
            formula = '';
            isResultShown = false;
        }

        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
    }
    else if (key === 'clear') {
        playSound('button-press');
        currentInput = '0';
        formula = '';
        isResultShown = false;
    }

    updateDisplay();
}

function formatOperatorSymbol(op) {
    if (op === '*') return '×';
    if (op === '/') return '÷';
    return op;
}
document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        handleInput(key);
    });
});
window.addEventListener('keydown', (e) => {
    let key = e.key.toLowerCase();
    let btnKey = null;
    if (key >= '0' && key <= '9') {
        btnKey = key;
    } else if (key === '.') {
        btnKey = '.';
    } else if (key === '+') {
        btnKey = '+';
    } else if (key === '-') {
        btnKey = '-';
    } else if (key === '*') {
        btnKey = '*';
    } else if (key === '/') {
        btnKey = '/';
        e.preventDefault();
    } else if (key === '%' || key === 'p') {
        btnKey = '%';
    } else if (key === 'enter' || key === '=') {
        btnKey = '=';
        e.preventDefault();
    } else if (key === 'backspace') {
        btnKey = 'backspace';
    } else if (key === 'escape' || key === 'c') {
        btnKey = 'clear';
    }

    if (btnKey !== null) {
        const btn = document.querySelector(`.calc-btn[data-key="${btnKey}"]`);
        if (btn) {
            btn.classList.add('pressed');
            handleInput(btnKey);
        }
    }
});

window.addEventListener('keyup', (e) => {
    let key = e.key.toLowerCase();
    let btnKey = null;

    if (key >= '0' && key <= '9') btnKey = key;
    else if (key === '.') btnKey = '.';
    else if (key === '+') btnKey = '+';
    else if (key === '-') btnKey = '-';
    else if (key === '*') btnKey = '*';
    else if (key === '/') btnKey = '/';
    else if (key === '%' || key === 'p') btnKey = '%';
    else if (key === 'enter' || key === '=') btnKey = '=';
    else if (key === 'backspace') btnKey = 'backspace';
    else if (key === 'escape' || key === 'c') btnKey = 'clear';

    if (btnKey !== null) {
        const btn = document.querySelector(`.calc-btn[data-key="${btnKey}"]`);
        if (btn) {
            setTimeout(() => {
                btn.classList.remove('pressed');
            }, 60);
        }
    }
});
formula = '';
currentInput = '0';
isResultShown = false;
updateDisplay();