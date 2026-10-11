// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
// 1,510 frames at 24 fps cover the complete 62.929s source track to the last
// available video frame. offset is estimated from the user's timed lyric cues.
const PROJECT = { duration: 1510 / 24, bpm: 90, offset: 0.57, audio: 'assets/cuihua.mp3' };
