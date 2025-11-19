// Very small stub — compute a dummy score based on transcript length and fill some fields.
function scoreTranscript(transcript) {
  if (!transcript) return { score: 0, emotion: 'neutral', points: 0, accent: 'unknown', dialect: 'unknown' };
  const words = transcript.split(/\s+/).length;
  const score = Math.min(100, Math.round(words / 2));
  const points = Math.round(score / 10);
  const emotions = ['neutral', 'happy', 'angry', 'sad', 'excited'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  return { score, emotion, points, accent: 'detected-accent', dialect: 'detected-dialect' };
}

module.exports = { scoreTranscript };
