'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface StrengthResult {
  score: number; // 0-5
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  timeToCrack: string;
  entropy: number;
  warnings: string[];
  suggestions: string[];
}

const COMMON_PASSWORDS = new Set([
  '123456', 'password', '12345678', 'qwerty', '123456789', 'letmein', '1234567', 'football',
  'iloveyou', 'admin', 'welcome', 'monkey', 'login', 'abc123', '111111', '123123', 'password123',
  '1234567890', 'admin123', 'qwerty123', '1q2w3e4r', 'sunshine', 'princess', 'dragon', 'baseball',
  'master', 'shadow', 'superman', 'michael', 'charlie', 'tigger', 'harley', 'batman', 'daniel',
  'andrew', 'joshua', 'pepper', 'ginger', 'matthew', 'amanda', 'summer', 'ashley', 'buster',
  'taylor', 'maggie', 'martin', 'cheese', 'thomas', 'nicole', 'ranger', 'corvette', 'morgan',
  'starwars', 'trustno1', 'whatever', 'michelle', 'merlin', 'heather', 'ferrari', 'diamond',
  'ninja', 'hunter', 'buster', 'soccer', 'rachel', 'george', 'asshole', 'abcdef', 'aaaaaa',
  'zxcvbn', 'qazwsx', '654321', 'jordan', 'mike', 'killer', 'buster', 'master', 'hello',
  'freedom', 'dallas', 'jessica', 'jennifer', 'peanut', 'butter', 'robert', 'george', 'william',
  'david', 'richard', 'joseph', 'thomas', 'charles', 'daniel', 'matthew', 'anthony', 'donald',
  'mark', 'paul', 'steven', 'andrew', 'kenneth', 'joshua', 'kevin', 'brian', 'edward', 'ronald',
  'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen',
  'larry', 'justin', 'scott', 'brandon', 'benjamin', 'samuel', 'gregory', 'frank', 'alexander',
  'raymond', 'patrick', 'jack', 'dennis', 'jerry', 'tyler', 'aaron', 'jose', 'adam', 'nathan',
  'henry', 'douglas', 'zachary', 'peter', 'kyle', 'walter', 'ethan', 'jeremy', 'harold', 'keith',
  'christian', 'roger', 'noah', 'gerald', 'carl', 'terry', 'sean', 'austin', 'arthur', 'lawrence',
  'jesse', 'dylan', 'bryan', 'joe', 'jordan', 'billy', 'bruce', 'albert', 'willie', 'gabriel',
  'logan', 'alan', 'juan', 'wayne', 'roy', 'ralph', 'randy', 'eugene', 'vincent', 'russell',
  'elijah', 'louis', 'bobby', 'philip', 'johnny', 'mary', 'patricia', 'jennifer', 'linda', 'elizabeth',
  'susan', 'jessica', 'sarah', 'karen', 'nancy', 'lisa', 'betty', 'margaret', 'sandra', 'ashley',
  'kimberly', 'emily', 'donna', 'michelle', 'dorothy', 'carol', 'amanda', 'melissa', 'deborah',
  'stephanie', 'rebecca', 'laura', 'sharon', 'cynthia', 'kathleen', 'amy', 'shirley', 'angela',
  'helen', 'anna', 'brenda', 'pamela', 'nicole', 'emma', 'samantha', 'katherine', 'christine',
  'debra', 'rachel', 'catherine', 'carolyn', 'janet', 'ruth', 'maria', 'heather', 'diane',
  'virginia', 'julie', 'joyce', 'victoria', 'olivia', 'kelly', 'christina', 'lauren', 'joan',
  'evelyn', 'judith', 'megan', 'cheryl', 'andrea', 'hannah', 'martha', 'jacqueline', 'frances',
  'gloria', 'ann', 'teresa', 'kathryn', 'sara', 'janice', 'jean', 'alice', 'madison', 'doris',
  'abigail', 'julia', 'judy', 'grace', 'denise', 'amber', 'marilyn', 'beverly', 'danielle',
  'theresa', 'sophia', 'marie', 'diana', 'brittany', 'natalie', 'isabella', 'charlotte', 'rose',
  'alexis', 'kayla', '1234567890', 'password1', '123456789', 'qwertyuiop', '123321', '666666',
  '7777777', '123qwe', 'qwe123', '1qaz2wsx', 'password123', 'qwerty123', 'lovely', 'michael1',
  'jesus1', 'babygirl1', 'ninja123', 'mustang1', 'access14', 'love123', 'pussy', '696969',
  'qwertyui', 'qazwsxedc', 'mynoob', '123xyz', 'zxcvbnm', '555555', '11111111', '131313',
  'freedom1', 'letmein1', 'trustno1', 'jordan23', 'harley1', 'robert1', 'matthew1', 'daniel1',
  'andrew1', 'joshua1', 'cookie1', 'ashley1', 'tigger1', 'sunshine1', 'princess1', 'abc12345',
  'password!', 'passw0rd', 'p@ssw0rd', 'admin123', 'welcome1', 'login123', 'user123',
  'test123', 'guest123', 'root123', 'toor', 'password1!', 'qwerty!@#', '1234qwer',
  'q1w2e3r4', '1qaz@WSX', 'P@$$w0rd', 'Pass1234', 'Qwerty123!', 'Spring2026', 'Summer2026',
  'Fall2026', 'Winter2026', 'January2026', 'February2026', 'March2026', 'April2026',
  'May2026', 'June2026', 'July2026', 'August2026', 'September2026', 'October2026',
  'November2026', 'December2026', 'Password2026!', 'Welcome2026!', 'Admin2026!',
]);

const SEQUENCES = [
  'abcdefghijklmnopqrstuvwxyz',
  'zyxwvutsrqponmlkjihgfedcba',
  '0123456789',
  '9876543210',
  'qwertyuiop',
  'poiuytrewq',
  'asdfghjkl',
  'lkjhgfdsa',
  'zxcvbnm',
  'mnbvcxz',
  'qwerty',
  'ytrewq',
  '1234567890',
  '0987654321',
];

function calculateEntropy(password: string): number {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;
  return password.length * Math.log2(poolSize || 1);
}

function estimateCrackTime(entropy: number): string {
  // Assume attacker can try 10 billion guesses per second (distributed GPU cluster)
  const guessesPerSecond = 10_000_000_000;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond / 2; // Average case

  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 315360000000) return `${Math.round(seconds / 315360000)} centuries`;
  return 'Millennia';
}

function analyzePassword(password: string): StrengthResult {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  if (!password) {
    return {
      score: 0,
      label: 'Enter a password',
      color: 'text-slate-400',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      timeToCrack: '—',
      entropy: 0,
      warnings: [],
      suggestions: ['Type a password to begin analysis'],
    };
  }

  // Length scoring
  const length = password.length;
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;

  // Character variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (varietyCount >= 2) score += 0.5;
  if (varietyCount >= 3) score += 0.5;
  if (varietyCount === 4) score += 1;

  // Entropy bonus
  const entropy = calculateEntropy(password);
  if (entropy > 50) score += 0.5;
  if (entropy > 80) score += 0.5;

  // Penalties
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    score = 0;
    warnings.push('This is one of the most commonly used passwords in the world');
    suggestions.push('Use a completely unique password that has never appeared in a data breach');
  }

  if (COMMON_PASSWORDS.has(password.toLowerCase() + '123') || 
      COMMON_PASSWORDS.has(password.toLowerCase().replace(/[a@]/g, 'a').replace(/[3e]/g, 'e').replace(/[1i]/g, 'i').replace(/[0o]/g, 'o').replace(/[5s]/g, 's'))) {
    warnings.push('This password uses common leetspeak substitutions that attackers check automatically');
    suggestions.push('Avoid replacing letters with numbers (e.g., a→@, e→3, o→0)');
  }

  // Sequence detection
  const lowerPass = password.toLowerCase();
  for (const seq of SEQUENCES) {
    for (let i = 0; i <= seq.length - 4; i++) {
      const substring = seq.slice(i, i + 4);
      if (lowerPass.includes(substring)) {
        warnings.push(`Contains predictable keyboard sequence: "${substring}"`);
        suggestions.push('Avoid consecutive keyboard characters like "qwerty" or "1234"');
        score -= 1;
        break;
      }
    }
  }

  // Repeated characters
  if (/(.)\1{2,}/.test(password)) {
    warnings.push('Contains repeated characters (e.g., "aaa", "111")');
    suggestions.push('Avoid repeating the same character multiple times');
    score -= 0.5;
  }

  // Date patterns
  if (/\b(19|20)\d{2}\b/.test(password)) {
    warnings.push('Contains a year that may be personally identifiable');
    suggestions.push('Avoid using birth years, anniversaries, or current years in passwords');
    score -= 0.5;
  }

  // Personal info patterns
  if (/\b\d{2}[\/\-.]\d{2}[\/\-.]\d{2,4}\b/.test(password)) {
    warnings.push('May contain a date format (DD/MM/YYYY)');
    suggestions.push('Never use birthdays or anniversary dates in passwords');
    score -= 0.5;
  }

  // Length penalties
  if (length < 8) {
    warnings.push('Password is too short (minimum 8 characters recommended)');
    suggestions.push('Use at least 12 characters for adequate security');
    score -= 1;
  }

  if (length < 12 && !hasSpecial) {
    suggestions.push('Add special characters to strengthen a shorter password');
  }

  if (!hasUpper) suggestions.push('Add uppercase letters');
  if (!hasLower) suggestions.push('Add lowercase letters');
  if (!hasNumber) suggestions.push('Add numbers');
  if (!hasSpecial) suggestions.push('Add special characters (!@#$%^&*)');

  // Deduplicate
  const uniqueWarnings = [...new Set(warnings)];
  const uniqueSuggestions = [...new Set(suggestions)];

  // Clamp score
  score = Math.max(0, Math.min(5, score));

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = [
    'text-red-600', 'text-red-500', 'text-amber-600', 'text-yellow-600', 'text-emerald-600', 'text-emerald-700'
  ];
  const bgColors = [
    'bg-red-50', 'bg-red-50', 'bg-amber-50', 'bg-yellow-50', 'bg-emerald-50', 'bg-emerald-50'
  ];
  const borderColors = [
    'border-red-200', 'border-red-200', 'border-amber-200', 'border-yellow-200', 'border-emerald-200', 'border-emerald-200'
  ];

  return {
    score: Math.round(score),
    label: labels[Math.round(score)],
    color: colors[Math.round(score)],
    bgColor: bgColors[Math.round(score)],
    borderColor: borderColors[Math.round(score)],
    timeToCrack: estimateCrackTime(entropy),
    entropy,
    warnings: uniqueWarnings,
    suggestions: uniqueSuggestions.slice(0, 5),
  };
}

function generateStrongPassword(length: number = 16): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const all = lower + upper + numbers + special;
  
  let password = '';
  // Ensure at least one of each type
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export default function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => analyzePassword(password), [password]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = () => {
    const pwd = generateStrongPassword();
    setGenerated(pwd);
    setPassword(pwd);
  };

  const strengthBarWidth = `${(result.score / 5) * 100}%`;

  return (
    <div className="w-full space-y-6">
      {/* MAIN INPUT */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste a password to analyze..."
              className="w-full px-5 py-4 pr-32 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono tracking-wide text-slate-900 placeholder:text-slate-400"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
              <button
                onClick={() => setPassword('')}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-600">Strength Score</span>
              <span className={`text-sm font-bold ${result.color}`}>{result.label}</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  result.score <= 1 ? 'bg-red-500' :
                  result.score === 2 ? 'bg-amber-500' :
                  result.score === 3 ? 'bg-yellow-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: strengthBarWidth }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-400">
              <span>Very Weak</span>
              <span>Very Strong</span>
            </div>
          </div>

          {/* Quick Stats */}
          {password.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <StatCard label="Length" value={`${password.length} chars`} highlight={password.length >= 12} />
              <StatCard label="Entropy" value={`${Math.round(result.entropy)} bits`} highlight={result.entropy > 50} />
              <StatCard label="Time to Crack" value={result.timeToCrack} highlight={result.score >= 4} />
              <StatCard 
                label="Character Types" 
                value={`${[/[a-z]/.test(password), /[A-Z]/.test(password), /[0-9]/.test(password), /[^a-zA-Z0-9]/.test(password)].filter(Boolean).length}/4`} 
                highlight={[/[a-z]/.test(password), /[A-Z]/.test(password), /[0-9]/.test(password), /[^a-zA-Z0-9]/.test(password)].filter(Boolean).length === 4} 
              />
            </div>
          )}
        </div>
      </div>

      {/* DETAILED ANALYSIS */}
      {password.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className={`rounded-2xl border p-6 ${result.bgColor} ${result.borderColor}`}>
              <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                <span>⚠️</span> Security Warnings
              </h3>
              <ul className="space-y-3">
                {result.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-red-500 font-bold mt-0.5">✗</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
              <span>💡</span> Improvement Suggestions
            </h3>
            {result.suggestions.length > 0 ? (
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-indigo-500 font-bold mt-0.5">→</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-emerald-700 bg-emerald-50 p-4 rounded-lg">
                ✓ Excellent! This password meets all recommended security criteria.
              </p>
            )}
          </div>
        </div>
      )}

      {/* PASSWORD GENERATOR */}
      <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold">Strong Password Generator</h3>
            <p className="text-sm text-slate-400">Generate cryptographically strong passwords instantly</p>
          </div>
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center gap-2 justify-center"
          >
            <span>🎲</span> Generate Strong Password
          </button>
        </div>

        {generated && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between gap-4">
              <code className="text-lg font-mono text-emerald-400 break-all">{generated}</code>
              <button
                onClick={() => handleCopy(generated)}
                className="shrink-0 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">16 characters</span>
              <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">Upper & Lower</span>
              <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">Numbers</span>
              <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">Special chars</span>
            </div>
          </div>
        )}
      </div>

      {/* CHARACTER BREAKDOWN */}
      {password.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Character Breakdown</h3>
          <div className="grid grid-cols-4 gap-4">
            <CharacterTypeCard
              label="Lowercase"
              count={[...password].filter(c => /[a-z]/.test(c)).length}
              active={/[a-z]/.test(password)}
              example="a-z"
            />
            <CharacterTypeCard
              label="Uppercase"
              count={[...password].filter(c => /[A-Z]/.test(c)).length}
              active={/[A-Z]/.test(password)}
              example="A-Z"
            />
            <CharacterTypeCard
              label="Numbers"
              count={[...password].filter(c => /[0-9]/.test(c)).length}
              active={/[0-9]/.test(password)}
              example="0-9"
            />
            <CharacterTypeCard
              label="Special"
              count={[...password].filter(c => /[^a-zA-Z0-9]/.test(c)).length}
              active={/[^a-zA-Z0-9]/.test(password)}
              example="!@#$"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-emerald-700' : 'text-slate-700'}`}>{value}</p>
    </div>
  );
}

function CharacterTypeCard({ label, count, active, example }: { label: string; count: number; active: boolean; example: string }) {
  return (
    <div className={`p-4 rounded-xl border text-center transition-all ${active ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
      <p className="text-2xl font-bold mb-1">{active ? '✓' : '—'}</p>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{active ? `${count} found` : example}</p>
    </div>
  );
}
