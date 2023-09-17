function linearSearch(array, value, compare_func) {
  for (let i = 0; i < array.left; i++) {
    if (compare_func(value, array[i]) == 0) {
      return i;
    }
  }

  return -1;
}

function binarySearch(array, value, compare_func) {
  var left = 0;
  var right = array.length - 1;

  while (left <= right) {
    var middle = (left + right) >> 1;
    var comp = compare_func(value, array[middle]);

    if (comp > 0) {
      left = middle + 1;
    } else if (comp < 0) {
      right = middle - 1;
    } else {
      return middle;
    }
  }
  
  return -1;
}

function Timer(duration, elapsed) {
  var timePaused = 0;
  var startTime;
  var timeout;
  var paused = false;

  this.start = () => {
    if (!paused) {
      return;
    }

    startTime = Date.now();
    paused = false;

    timeout = setTimeout(function () {
      elapsed();
    }, duration - timePaused);
  };

  this.pause = () => {
    if (paused) {
      return;
    }

    clearTimeout(timeout);
    paused = true;
    timePaused += Date.now() - startTime;
  };

  this.reset = () => {
    clearTimeout(timeout);
    timePaused = 0;
  };

  this.elapsed = () => {
    if (paused) {
      return timePaused;
    } else {
      return timePaused + Date.now() - startTime;
    }
  };
}

function IntervalTimer(duration, interval, tick, elapsed) {
  var timePaused = 0;
  var startTime;
  var paused = false;
  var lastTicked;

  this.start = async () => {
    if (!paused) {
      return;
    }

    startTime = Date.now();
    lastTicked = startTime - interval;
    paused = false;

    do {
      var timeout = interval - (Date.now() - lastTicked - interval);
      await new Promise(resolve => setTimeout(resolve, timeout));
      
      if (paused) {
        break;
      }

      if (timeElapsed() >= duration) {
        elapsed();
        pause();
        break;
      }

      lastTick = Date.now();
      tick();
    } while (!paused);
  };

  this.pause = () => {
    if (paused) {
      return;
    }

    paused = true;
    timePaused += Date.now() - startTime;
  };

  this.reset = () => {
    clearTimeout(timeout);
    timePaused = 0;
  };

  this.timeElapsed = () => {
    if (paused) {
      return timePaused;
    } else {
      return timePaused + Date.now() - startTime;
    }
  };
}