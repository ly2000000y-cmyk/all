// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
// 《翠花》: 90 BPM, first downbeat at 0.31 s. The clip's music ends at ~58.3 s; its spoken platform tag (60.8 s) is cut.
const PROJECT = { duration: 60, bpm: 90, offset: 0.31, audio: 'assets/cuihua.wav' };
