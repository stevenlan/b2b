import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'


export default function  signVideo(app) {
  app.use(VueVideoPlayer)
}
