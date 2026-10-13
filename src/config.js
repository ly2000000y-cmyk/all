// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
// 《22》: retain the package's ~92.8 BPM / 0.34s beat offset; recording length verified as 62.6155s.
const PROJECT = { duration: 62.6, bpm: 92.8, offset: 0.34, audio: 'assets/22.mp3' };
