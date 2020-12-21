class Sound {
    self: HTMLAudioElement;

    constructor(src: string) {
        this.self = document.createElement("audio");
        this.self.src = src;
        this.self.setAttribute("preload", "auto");
        this.self.setAttribute("controls", "none");
        this.self.style.display = "none";
        document.body.appendChild(this.self);
    }

    play() {
        this.self.play();
    }
}

export default Sound;