var context = new (window.AudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();
var source;
var audio0 = new Audio();
audio0.src = './myach.mp3';
// audio0.controls = true;
// audio0.autoplay = true;
audio0.loop = true;
source = context.createMediaElementSource(audio0);
source.connect(analyser);
analyser.connect(context.destination);
// let isPlaying = true;
// audio0.play();
// window.onkeydown = function(e) {
//   if(e.keyCode === 77) {
//     if(!isPlaying){
//       console.log('playing');
//       isPlaying = true;
//       // audio0.play();
//     }else{
//       console.log('not playing');
//       isPlaying = false;
//       audio0.pause();
//       audio0.currentTime = 0;
//     }
//   }
// };
