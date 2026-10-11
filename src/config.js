// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
// 《22》: 92.9 BPM (measured: spectral flux, local), first downbeat 0.34 s. 24 bars = 62.0 s; the clip is 62.6 s and fades out by itself.
const PROJECT = { duration: 62.6, bpm: 92.9, offset: 0.34, audio: 'assets/22.mp3' };
