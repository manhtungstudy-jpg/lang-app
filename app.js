/**
 * UAIR AMHÁIN - Game Engine & Learning Interactive System
 * Pure English & Irish | Standalone Floating Characters | Visual FX
 */

// =========================================================
// 1. WEB AUDIO API - SOUND MANAGER
// =========================================================
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmGain = null;
    this.sfxGain = null;
    this.isPlayingBGM = false;
    this.birdTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);

      this.startCelticAmbience();
      this.scheduleRandomBirds();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.isMuted) {
        this.bgmGain.gain.setTargetAtTime(0, now, 0.05);
        this.sfxGain.gain.setTargetAtTime(0, now, 0.05);
      } else {
        this.bgmGain.gain.setTargetAtTime(0.25, now, 0.05);
        this.sfxGain.gain.setTargetAtTime(0.4, now, 0.05);
      }
    }
    return !this.isMuted;
  }

  startCelticAmbience() {
    if (this.isPlayingBGM) return;
    this.isPlayingBGM = true;
    const celticNotes = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99];
    let noteIndex = 0;

    const playHarpPluck = () => {
      if (!this.isMuted && this.ctx && this.ctx.state === 'running') {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'triangle';
        const freq = celticNotes[noteIndex % celticNotes.length];
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.1, now + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

        osc.connect(noteGain);
        noteGain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 1.5);

        const step = Math.floor(Math.random() * 3) + 1;
        noteIndex = (noteIndex + step) % celticNotes.length;
      }
      setTimeout(playHarpPluck, 450 + Math.random() * 550);
    };
    playHarpPluck();
  }

  scheduleRandomBirds() {
    const playChirp = () => {
      if (!this.isMuted && this.ctx && this.ctx.state === 'running') {
        this.playBirdChirp();
      }
      this.birdTimer = setTimeout(playChirp, 3000 + Math.random() * 4000);
    };
    playChirp();
  }

  playBirdChirp() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 2200 + Math.random() * 800;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(startFreq - 400, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  playButtonClick() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Celebration fanfare sound effect when answering correctly
  playMagicSuccess() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.8);
      }, idx * 90);
    });
  }

  playErrorSound() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}

const sounds = new SoundManager();

// =========================================================
// 2. CONFETTI & CELEBRATION PARTICLE CANVAS ENGINE
// =========================================================
class ClassroomFX {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.confetti = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = this.canvas.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.height = this.canvas.parentElement.clientHeight;
  }

  burstConfetti() {
    for (let i = 0; i < 60; i++) {
      this.confetti.push({
        x: this.width * 0.5 + (Math.random() - 0.5) * 200,
        y: this.height * 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 10 - 4,
        size: Math.random() * 8 + 4,
        color: ['#ffd700', '#2ed573', '#ff4757', '#1e90ff', '#ffa500', '#ffffff'][Math.floor(Math.random() * 6)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        life: 0,
        maxLife: 80 + Math.random() * 40
      });
    }
    this.animate();
  }

  animate() {
    if (this.confetti.length === 0) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const p = this.confetti[i];
      p.vy += 0.35; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life++;

      const alpha = Math.max(0, 1 - p.life / p.maxLife);

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();

      if (p.life >= p.maxLife) {
        this.confetti.splice(i, 1);
      }
    }

    if (this.confetti.length > 0) {
      requestAnimationFrame(() => this.animate());
    }
  }
}

const classroomFX = new ClassroomFX('classroom-canvas');

// =========================================================
// 3. IRISH PHONETIC SPEECH SYNTHESIS ENGINE
// =========================================================
function speakIrishPhrase(phrase) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'en-IE';
    utterance.rate = 0.88;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const irishVoice = voices.find(v => v.lang.includes('en-IE') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
    if (irishVoice) utterance.voice = irishVoice;

    window.speechSynthesis.speak(utterance);
  }
}

// Helper to spawn floating "+5 Stars ⭐" popup animation
function spawnFloatingRewardText(text) {
  const layer = document.getElementById('floating-rewards-layer');
  const popup = document.createElement('div');
  popup.className = 'floating-reward';
  popup.textContent = text;
  popup.style.left = '50%';
  popup.style.top = '45%';
  layer.appendChild(popup);

  setTimeout(() => {
    if (popup.parentNode) popup.parentNode.removeChild(popup);
  }, 1600);
}

// Trigger character bounce celebration
function triggerCharacterCelebration() {
  const muime = document.getElementById('class-teacher-container');
  const cara = document.getElementById('class-cara-container');

  muime.classList.add('celebrate');
  cara.classList.add('celebrate');

  setTimeout(() => {
    muime.classList.remove('celebrate');
    cara.classList.remove('celebrate');
  }, 800);
}

// =========================================================
// 4. GAME STATE & MANAGER
// =========================================================
class AppGameManager {
  constructor() {
    this.score = 0;
    this.currentView = 'lesson';
    this.vsoLevel = 0;
    this.vsoSelectedSlots = [null, null, null];
    this.mutationFirstCard = null;
    this.quizIndex = 0;
    this.quizScore = 0;

    // VSO Levels Data
    this.vsoChallenges = [
      {
        en: 'Cara reads the book',
        correct: ['Léann', 'Cara', 'an leabhar'],
        words: ['Léann', 'an leabhar', 'Cara']
      },
      {
        en: 'I am running in the park',
        correct: ['Tá', 'mé', 'ag rith'],
        words: ['ag rith', 'Tá', 'mé']
      },
      {
        en: 'The cat sees the bird',
        correct: ['Feiceann', 'an cat', 'an t-éan'],
        words: ['an cat', 'Feiceann', 'an t-éan']
      }
    ];

    // Mutation Matcher Pairs
    this.mutationPairs = [
      { id: '1', root: 'máthair (mother)', mutated: 'mo mháthair (my mother)' },
      { id: '2', root: 'doras (door)', mutated: 'ár ndoras (our door)' },
      { id: '3', root: 'cairde (friends)', mutated: 'ár gcairde (our friends)' },
      { id: '4', root: 'leabhar (book)', mutated: 'mo leabhar (my book)' }
    ];

    // Quiz Questions Data
    this.quizQuestions = [
      {
        q: 'How do you say "Hello" in Irish?',
        options: ['Dia dhuit!', 'Slán!', 'Go raibh maith agat', 'Oíche mhaith'],
        correct: 0,
        tip: 'Dia dhuit literally means "God be with you"!'
      },
      {
        q: 'In Irish sentences, which part of speech comes FIRST?',
        options: ['Subject (Ainmní)', 'Verb (Gníomh)', 'Object (Cuspóir)', 'Adjective'],
        correct: 1,
        tip: 'Irish is a VSO language (Verb-Subject-Object)!'
      },
      {
        q: 'What is the Irish reply to "Conas atá tú?" (How are you)?',
        options: ['Tá mé go maith!', 'Is mise Cara', 'Slán go fóill', 'Dia dhuit'],
        correct: 0,
        tip: '"Tá mé go maith" means "I am doing well"!'
      },
      {
        q: 'What happens to "máthair" when you say "mo" (my)?',
        options: ['mo mmáthair', 'mo mháthair (Séimhiú)', 'mo nmáthair', 'mo máthair'],
        correct: 1,
        tip: 'Séimhiú adds the letter "h" after the consonant!'
      }
    ];
  }

  addScore(pts) {
    this.score += pts;
    document.getElementById('player-score').textContent = `Stars: ${this.score}`;
  }

  // --- VSO Train Game Logic ---
  loadVSOChallenge() {
    const challenge = this.vsoChallenges[this.vsoLevel % this.vsoChallenges.length];
    document.getElementById('vso-target-text').textContent = `"${challenge.en}"`;
    document.getElementById('vso-feedback').textContent = '';
    this.vsoSelectedSlots = [null, null, null];

    for (let i = 0; i < 3; i++) {
      document.getElementById(`slot-${i}`).innerHTML = '';
    }

    const pool = document.getElementById('vso-words-pool');
    pool.innerHTML = '';
    challenge.words.forEach((word) => {
      const btn = document.createElement('button');
      btn.className = 'word-block-cart';
      btn.textContent = word;
      btn.addEventListener('click', () => {
        sounds.playButtonClick();
        this.placeWordInNextSlot(word, btn);
      });
      pool.appendChild(btn);
    });
  }

  placeWordInNextSlot(word, blockBtn) {
    const emptyIndex = this.vsoSelectedSlots.findIndex(s => s === null);
    if (emptyIndex !== -1) {
      this.vsoSelectedSlots[emptyIndex] = word;
      const slotEl = document.getElementById(`slot-${emptyIndex}`);
      slotEl.innerHTML = `<span class="word-block-cart">${word}</span>`;
      blockBtn.style.display = 'none';

      slotEl.onclick = () => {
        sounds.playButtonClick();
        this.vsoSelectedSlots[emptyIndex] = null;
        slotEl.innerHTML = '';
        blockBtn.style.display = 'inline-block';
        slotEl.onclick = null;
      };
    }
  }

  checkVSOAnswer() {
    const challenge = this.vsoChallenges[this.vsoLevel % this.vsoChallenges.length];
    const feedback = document.getElementById('vso-feedback');
    const isFull = this.vsoSelectedSlots.every(s => s !== null);

    if (!isFull) {
      feedback.className = 'game-feedback error';
      feedback.textContent = '⚠️ Fill all 3 train slots first!';
      sounds.playErrorSound();
      return;
    }

    const isCorrect = this.vsoSelectedSlots.every((val, idx) => val === challenge.correct[idx]);
    if (isCorrect) {
      feedback.className = 'game-feedback success';
      feedback.textContent = '🎉 Iontach! Correct! Verb comes first in Irish!';
      
      // Visual & Audio Celebrations
      sounds.playMagicSuccess();
      classroomFX.burstConfetti();
      spawnFloatingRewardText('+5 Stars ⭐');
      triggerCharacterCelebration();

      this.addScore(5);
      speakIrishPhrase(challenge.correct.join(' '));

      document.getElementById('cara-bubble-text').textContent = `“Maith thú! You built '${challenge.correct.join(' ')}' correctly! +5 Stars! ⭐”`;

      setTimeout(() => {
        this.vsoLevel++;
        this.loadVSOChallenge();
      }, 2000);
    } else {
      feedback.className = 'game-feedback error';
      feedback.textContent = '❌ Not quite! Remember: Verb $\\rightarrow$ Subject $\\rightarrow$ Object!';
      sounds.playErrorSound();
    }
  }

  // --- Mutation Matcher Game Logic ---
  loadMutationGame() {
    const grid = document.getElementById('mutation-cards-grid');
    grid.innerHTML = '';
    document.getElementById('mutation-feedback').textContent = '';
    this.mutationFirstCard = null;

    const cards = [];
    this.mutationPairs.forEach(pair => {
      cards.push({ id: pair.id, text: pair.root, type: 'root' });
      cards.push({ id: pair.id, text: pair.mutated, type: 'mutated' });
    });

    cards.sort(() => Math.random() - 0.5);

    cards.forEach(c => {
      const cardEl = document.createElement('div');
      cardEl.className = 'mutation-card';
      cardEl.textContent = c.text;
      cardEl.dataset.id = c.id;

      cardEl.addEventListener('click', () => {
        sounds.playButtonClick();
        this.handleMutationCardClick(cardEl, c);
      });
      grid.appendChild(cardEl);
    });
  }

  handleMutationCardClick(cardEl, cardData) {
    if (cardEl.classList.contains('matched') || cardEl.classList.contains('selected')) return;

    cardEl.classList.add('selected');

    if (!this.mutationFirstCard) {
      this.mutationFirstCard = { el: cardEl, data: cardData };
    } else {
      const first = this.mutationFirstCard;
      const second = { el: cardEl, data: cardData };
      this.mutationFirstCard = null;

      if (first.data.id === second.data.id && first.data.type !== second.data.type) {
        // Match!
        sounds.playMagicSuccess();
        classroomFX.burstConfetti();
        spawnFloatingRewardText('+5 Stars ⭐');
        triggerCharacterCelebration();

        first.el.classList.remove('selected');
        second.el.classList.remove('selected');
        first.el.classList.add('matched');
        second.el.classList.add('matched');

        this.addScore(5);
        document.getElementById('mutation-feedback').className = 'game-feedback success';
        document.getElementById('mutation-feedback').textContent = '✨ Match found! Great job!';

        const allMatched = document.querySelectorAll('.mutation-card.matched').length === this.mutationPairs.length * 2;
        if (allMatched) {
          document.getElementById('teacher-bubble-text').textContent = '“Fíor-mhaith! You conquered Irish Séimhiú & Urú mutations! +10 Bonus Stars!”';
          spawnFloatingRewardText('+10 Bonus Stars ⭐');
          this.addScore(10);
        }
      } else {
        // Mismatch
        sounds.playErrorSound();
        document.getElementById('mutation-feedback').className = 'game-feedback error';
        document.getElementById('mutation-feedback').textContent = '❌ Try again!';
        setTimeout(() => {
          first.el.classList.remove('selected');
          second.el.classList.remove('selected');
        }, 800);
      }
    }
  }

  // --- Celtic Quiz Logic ---
  loadQuiz() {
    this.quizIndex = 0;
    this.quizScore = 0;
    document.getElementById('quiz-victory').classList.add('hidden');
    document.getElementById('quiz-container').style.display = 'flex';
    this.showQuizQuestion();
  }

  showQuizQuestion() {
    const q = this.quizQuestions[this.quizIndex];
    document.getElementById('quiz-q-num').textContent = `Question ${this.quizIndex + 1} of ${this.quizQuestions.length}`;
    document.getElementById('quiz-q-text').textContent = q.q;
    document.getElementById('quiz-progress-fill').style.width = `${((this.quizIndex + 1) / this.quizQuestions.length) * 100}%`;
    document.getElementById('quiz-feedback').textContent = '';

    const list = document.getElementById('quiz-options-list');
    list.innerHTML = '';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
      btn.addEventListener('click', () => {
        this.handleQuizAnswer(idx, btn);
      });
      list.appendChild(btn);
    });
  }

  handleQuizAnswer(selectedIdx, btnEl) {
    const q = this.quizQuestions[this.quizIndex];
    const feedback = document.getElementById('quiz-feedback');
    const allBtns = document.querySelectorAll('.quiz-opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (selectedIdx === q.correct) {
      btnEl.style.background = '#2ed573';
      btnEl.style.color = '#fff';
      
      sounds.playMagicSuccess();
      classroomFX.burstConfetti();
      spawnFloatingRewardText('+5 Stars ⭐');
      triggerCharacterCelebration();

      feedback.className = 'game-feedback success';
      feedback.textContent = `🎉 Correct! ${q.tip}`;
      this.quizScore++;
      this.addScore(5);
    } else {
      btnEl.style.background = '#ff4757';
      btnEl.style.color = '#fff';
      allBtns[q.correct].style.background = '#2ed573';
      allBtns[q.correct].style.color = '#fff';
      sounds.playErrorSound();
      feedback.className = 'game-feedback error';
      feedback.textContent = `❌ ${q.tip}`;
    }

    setTimeout(() => {
      this.quizIndex++;
      if (this.quizIndex < this.quizQuestions.length) {
        this.showQuizQuestion();
      } else {
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('quiz-victory').classList.remove('hidden');
        document.getElementById('victory-stars-display').textContent = '⭐'.repeat(Math.max(1, this.quizScore));
        
        sounds.playMagicSuccess();
        classroomFX.burstConfetti();
        triggerCharacterCelebration();
      }
    }, 1800);
  }
}

// =========================================================
// 5. SCENE CONTROLLERS & INITIALIZATION
// =========================================================
window.addEventListener('DOMContentLoaded', () => {
  const gameManager = new AppGameManager();

  // Navigation tab switching
  const navTabs = document.querySelectorAll('.nav-tab');
  const boardViews = document.querySelectorAll('.board-view');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sounds.playButtonClick();
      const targetView = tab.dataset.view;

      navTabs.forEach(t => t.classList.remove('active'));
      boardViews.forEach(v => v.classList.remove('active'));

      tab.classList.add('active');
      const viewEl = document.getElementById(`view-${targetView}`);
      if (viewEl) viewEl.classList.add('active');

      if (targetView === 'vso-game') gameManager.loadVSOChallenge();
      if (targetView === 'mutation-game') gameManager.loadMutationGame();
      if (targetView === 'quiz') gameManager.loadQuiz();
    });
  });

  // Audio Toggle
  const audioBtn = document.getElementById('btn-audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const audioBtnText = document.getElementById('audio-btn-text');

  audioBtn.addEventListener('click', () => {
    const isUnmuted = sounds.toggleMute();
    if (isUnmuted) {
      audioIcon.textContent = '🔊';
      audioBtnText.textContent = 'Sound: ON';
    } else {
      audioIcon.textContent = '🔇';
      audioBtnText.textContent = 'Sound: OFF';
    }
  });

  document.body.addEventListener('click', () => {
    sounds.init();
  }, { once: true });

  // Fullscreen
  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Auto-fill Demo
  document.getElementById('btn-quick-fill').addEventListener('click', () => {
    sounds.playButtonClick();
    document.getElementById('username').value = 'admin';
    document.getElementById('password').value = '123';
    document.getElementById('login-error-msg').textContent = '';
  });

  // Scene Elements
  const loginScene = document.getElementById('login-scene');
  const videoScene = document.getElementById('video-scene');
  const classroomScene = document.getElementById('classroom-scene');
  const transitionOverlay = document.getElementById('transition-overlay');
  const videoPlayer = document.getElementById('intro-video-player');
  const videoPlayOverlay = document.getElementById('video-play-overlay');

  function enterClassroom() {
    videoPlayer.pause();
    transitionOverlay.classList.add('fade-in');

    setTimeout(() => {
      videoScene.classList.remove('active');
      loginScene.classList.remove('active');
      classroomScene.classList.add('active');

      gameManager.loadVSOChallenge();

      setTimeout(() => {
        transitionOverlay.classList.remove('fade-in');
      }, 400);
    }, 700);
  }

  // Login Form Submission
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (user === 'admin' && pass === '123') {
      document.getElementById('login-error-msg').textContent = '';
      sounds.playMagicSuccess();

      transitionOverlay.classList.add('fade-in');
      document.getElementById('transition-main-text').textContent = 'Opening the Irish Folktale Cinema...';
      document.getElementById('transition-sub-text').textContent = 'Scéal na hÉireann ag tosú...';

      setTimeout(() => {
        loginScene.classList.remove('active');
        videoScene.classList.add('active');

        setTimeout(() => {
          transitionOverlay.classList.remove('fade-in');
          videoPlayer.play().then(() => {
            videoPlayOverlay.classList.add('hidden');
          }).catch(() => {
            videoPlayOverlay.classList.remove('hidden');
          });
        }, 500);

      }, 900);

    } else {
      sounds.playErrorSound();
      document.getElementById('login-error-msg').textContent = '❌ Invalid username or password (Try admin / 123)';
    }
  });

  // Big Play Button
  document.getElementById('btn-play-video-big').addEventListener('click', () => {
    sounds.playButtonClick();
    videoPlayer.play();
    videoPlayOverlay.classList.add('hidden');
  });

  videoPlayer.addEventListener('ended', () => {
    enterClassroom();
  });

  document.getElementById('btn-skip-video').addEventListener('click', () => {
    sounds.playButtonClick();
    enterClassroom();
  });

  // Pronunciation on Card Click
  document.querySelectorAll('.irish-card').forEach(card => {
    card.addEventListener('click', () => {
      sounds.playButtonClick();
      const phrase = card.dataset.phrase;
      speakIrishPhrase(phrase);
      gameManager.addScore(1);
      spawnFloatingRewardText('+1 Star ⭐');
    });
  });

  document.getElementById('btn-start-vso-from-lesson').addEventListener('click', () => {
    document.getElementById('tab-game1').click();
  });

  document.getElementById('btn-vso-check').addEventListener('click', () => {
    gameManager.checkVSOAnswer();
  });

  document.getElementById('btn-vso-reset').addEventListener('click', () => {
    sounds.playButtonClick();
    gameManager.loadVSOChallenge();
  });

  document.getElementById('btn-restart-adventure').addEventListener('click', () => {
    sounds.playButtonClick();
    document.getElementById('tab-lesson').click();
  });

  document.getElementById('btn-back-from-class').addEventListener('click', () => {
    sounds.playButtonClick();
    transitionOverlay.classList.add('fade-in');

    setTimeout(() => {
      classroomScene.classList.remove('active');
      loginScene.classList.add('active');

      setTimeout(() => {
        transitionOverlay.classList.remove('fade-in');
      }, 400);
    }, 700);
  });
});
