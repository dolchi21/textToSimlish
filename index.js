
let audioContext;
let activeNodes = [];
let playToken = 0;

async function textToSimlish(text) {
  const token = ++playToken;
  stopSimlish();

  if (!text.trim()) return;

  audioContext ??= new AudioContext();
  await audioContext.resume();

  if (token !== playToken) return;

  const ctx = audioContext;
  const words = text.match(/[\p{L}\p{N}]+|[,.!?;:]+/gu) || [];

  const consonants = [
    "b", "d", "g", "l", "m", "n",
    "v", "z", "w", "y", "sh", "ch"
  ];
  const vowels = ["a", "e", "i", "o", "u"];

  function hash(str) {
    let h = 2166136261;
    for (const c of str) {
      h ^= c.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function pseudoWord(word) {
    let seed = hash(word.toLowerCase());

    function random() {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    const count = Math.max(1, Math.min(5, Math.round(word.length / 2.5)));
    let result = "";

    for (let i = 0; i < count; i++) {
      if (i === 0 || random() > 0.25) {
        result += consonants[Math.floor(random() * consonants.length)];
      }

      result += vowels[Math.floor(random() * vowels.length)];

      if (random() > 0.72) {
        result += consonants[Math.floor(random() * consonants.length)];
      }
    }

    return result;
  }

  function playSyllable(syllable, start, duration, pitch) {
    const vowel = syllable.match(/[aeiou]/)?.[0] || "a";

    const formants = {
      a: [800, 1200],
      e: [500, 1900],
      i: [300, 2300],
      o: [500, 900],
      u: [350, 700]
    };

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const secondFilter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(pitch, start);
    osc.frequency.exponentialRampToValueAtTime(
      pitch * (0.88 + Math.random() * 0.24),
      start + duration
    );

    filter.type = "bandpass";
    filter.frequency.value = formants[vowel][0];
    filter.Q.value = 2.5;

    secondFilter.type = "peaking";
    secondFilter.frequency.value = formants[vowel][1];
    secondFilter.Q.value = 1.2;
    secondFilter.gain.value = 5;

    const attack = Math.min(0.035, duration * 0.25);
    const release = Math.min(0.065, duration * 0.35);
    const end = start + duration;

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.13, start + attack);
    gain.gain.setValueAtTime(
      0.13,
      Math.max(start + attack, end - release)
    );
    gain.gain.linearRampToValueAtTime(0.001, end);

    osc.connect(filter);
    filter.connect(secondFilter);
    secondFilter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(end + 0.01);
    activeNodes.push(osc);
  }

  let time = ctx.currentTime + 0.08;

  for (const word of words) {
    if (token !== playToken) return;

    if (/^[,.!?;:]+$/.test(word)) {
      time += /[.!?]/.test(word) ? 0.28 : 0.12;
      continue;
    }

    const simlish = pseudoWord(word);
    const syllables = simlish.match(
      /(?:sh|ch|[bdglm n v z w y])?[aeiou](?:[bdglmnvzwy])?/g
    ) || [simlish];

    const wordDuration = Math.min(
      0.9,
      Math.max(0.22, word.length * 0.065)
    );
    const duration = wordDuration / syllables.length;

    for (const syllable of syllables) {
      if (token !== playToken) return;

      playSyllable(
        syllable,
        time,
        duration * 0.92,
        145 + Math.random() * 115
      );

      time += duration * (0.78 + Math.random() * 0.12);
    }

    time += 0.09 + Math.random() * 0.08;
  }
}

function stopSimlish() {
  for (const node of activeNodes) {
    try {
      node.stop();
    } catch {}
  }
  activeNodes = [];
}

// Uso:
// textToSimlish("Hello, how are you?");
// stopSimlish();
