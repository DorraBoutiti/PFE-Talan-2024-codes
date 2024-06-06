import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  private audio1 = new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/clickUp.mp3");

  playAudio() {
    this.audio1.load();
    this.audio1.play();
  }

  playNotification() {
    let audio3 = new Audio("https://prodigits.co.uk/content/ringtones/tone/2020/alert/preview/4331e9c25345461.mp3");
    audio3.load();
    audio3.play();
  }
}

