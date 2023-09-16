export class Timer {
    duration: number;
    timePaused: number = 0;
    startTime: number;
    timeout: any = null;
    paused: boolean = false;
    elapsed: Function;

    constructor(duration: number, elapsed: Function) {
        this.duration = duration;
        this.startTime = Date.now();
        this.elapsed = elapsed;
    }
  
    start(): void {
      if (!this.paused) {
        return;
      }

      this.startTime = Date.now();
      this.paused = false;
  
      this.timeout = setTimeout(() => {
        this.elapsed();
      }, this.duration - this.timePaused);
    };
  
    pause(): void {
      if (this.paused) {
        return;
      }

      clearTimeout(this.timeout);
      this.paused = true;
      this.timePaused += Date.now() - this.startTime;
    };
  
    reset(): void {
      clearTimeout(this.timeout);
      this.timePaused = 0;
    };
  
    get timeElapsed(): number {
      if (this.paused) {
        return this.timePaused;
      } else {
        return this.timePaused + Date.now() - this.startTime;
      }
    };
}

export class IntervalTimer {
    duration: number;
    interval: number;
    tick: Function;
    elapsed: Function;
    
    timePaused: number = 0;
    startTime: number = 0;
    lastTick: number = 0;
    timeout: any = null;
    paused: boolean = true;

    constructor(duration: number, interval: number, tick: Function, elapsed: Function) {
        this.duration = duration * 1000;
        this.interval = interval * 1000;
        this.tick = tick;
        this.elapsed = elapsed;
    }
  
    async start() {
      if (!this.paused) {
        return;
      }

      this.startTime = Date.now();
      this.lastTick = this.startTime - this.interval;
      this.paused = false;

      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (this.paused) {
          break;
        }

        if (this.timeElapsed >= this.duration) {
          this.elapsed();
          this.pause();
          break;
        }

        this.lastTick = Date.now();
        this.tick();
      } while (!this.paused);
    };
  
    pause(): void {
      if (this.paused) {
        return;
      }

      this.paused = true;
      this.timePaused += Date.now() - this.startTime;
    };
  
    reset(): void {
      clearTimeout(this.timeout);
      this.timePaused = 0;
    };
  
    get timeElapsed(): number {
      if (this.paused) {
        return this.timePaused;
      } else {
        return this.timePaused + Date.now() - this.startTime;
      }
    };
}