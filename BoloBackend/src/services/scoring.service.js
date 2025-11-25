// Very small stub — compute a dummy score based on transcript length and fill some fields.

/**
 * Scores a transcript against a news article.
 * @param {string} transcript - The transcript text.
 * @param {string} article - The news article text.
 * @param {number} audioDuration - The audio duration in seconds.
 * @returns {object} Scoring metrics and percentage score.
 */
function scoreTranscript(transcript, article = '', audioDuration = 0) {
  if (!transcript) {
    return {
      score: 0,
      audioDuration: 0,
      totalWords: 0,
      uniqueWords: 0,
      newWords: 0,
      emotion: 'neutral',
      points: 0,
      accent: 'unknown',
      dialect: 'unknown',
    };
  }

  // Normalize and split into words
  const transcriptWords = transcript.toLowerCase().match(/\b\w+\b/g) || [];
  const articleWords = article.toLowerCase().match(/\b\w+\b/g) || [];
  const totalWords = transcriptWords.length;
  const uniqueWordsSet = new Set(transcriptWords);
  const uniqueWords = uniqueWordsSet.size;
  const articleWordsSet = new Set(articleWords);
  // New words: in transcript but not in article
  const newWords = Array.from(uniqueWordsSet).filter(w => !articleWordsSet.has(w)).length;

  // Example scoring: 50% weight to new words ratio, 30% to unique/total, 20% to duration (normalized)
  const newWordsRatio = totalWords ? newWords / totalWords : 0;
  const uniqueWordsRatio = totalWords ? uniqueWords / totalWords : 0;
  const durationScore = Math.min(1, audioDuration / 300); // cap at 5 min (300s)
  const score = Math.round(
    (newWordsRatio * 50 + uniqueWordsRatio * 30 + durationScore * 20)
  );

  // Dummy values for other fields
  const points = Math.round(score / 10);
  const emotions = ['neutral', 'happy', 'angry', 'sad', 'excited'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];

  return {
    score, // percentage
    audioDuration,
    totalWords,
    uniqueWords,
    newWords,
    emotion,
    points,
    accent: 'detected-accent',
    dialect: 'detected-dialect',
  };
}

module.exports = { scoreTranscript };
