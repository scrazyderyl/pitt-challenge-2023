function Map() {
    var _map = document.getElementById("map");

    var tiles = [];
    
    this.load = () => {
        for (let i = 0; i < MAP.locations.length; i++) {
            var location = MAP.locations[i];
            var tile = new Location(location);
            _map.appendChild(tile.getElement());
            tiles.push(tile);
        }
    };

    this.updateVisbility = () => {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].updateVisibility();
        }
    }

    this.getLocation = (id) => {
        var index = binarySearch(tiles, id, (a, b) => a.localeCompare(b.id));
        return tiles[index];
    }
}

function Location(location) {
    var tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.left = `${location.x}px`;
    tile.style.top = `${location.y}px`;

    var alert = document.createElement("div");
    alert.classList.add("task-alert");
    alert.classList.add("hidden");
    alert.textContent = "!";
    tile.appendChild(alert);
    alert.addEventListener("click", () => {
        taskManager.startTask(tasks[0]);
    });

    var icon = document.createElement("img");
    icon.src = `./assets/${location.id}.png`;
    icon.width = location.width;
    tile.appendChild(icon);

    var tasks = [];

    this.id = location.id;

    this.getElement = () => {
        return tile;
    }

    this.updateVisibility = () => {
        if (user.getLevel() < location.minLevel) {
            tile.classList.add("locked");
        } else {
            tile.classList.remove("locked");
        }
    }

    this.updateVisibility();

    this.addTask = (task) => {
        if (tasks.length == 0) {
            this.showTaskAlert();
        }

        tasks.push(task);
    }

    this.removeTask = (task) => {
        tasks.splice(tasks.indexOf(task), 1);

        if (tasks.length == 0) {
            this.hideTaskAlert();
        }
    }

    this.showTaskAlert = () => {
        alert.classList.remove("hidden");
        alert.classList.add("jitter")

        setTimeout(() => {
            alert.classList.remove("jitter");
        }, 800);
    }

    this.hideTaskAlert = () => {
        alert.classList.add("hidden");
    }
}

function User() {
    var name;
    var level;
    var xp;
    var maxxp;

    this.readSave = async (username) => {
        const response = await fetch(`${SERVER_PATH}/${username}`, {
            method: "GET",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json"
            }
        });
        // const data = await response.json();
        const data = {
            name: "",
            level: 1,
            xp: 0,
            time: [1, 0],
            lastTaskCreated: [1, 0],
            lastEventCreated: [1, 0],
            lastScenarioCreated: 1,
            activeScenario: null,
            activeTasks: []
        }
        
        name = data.name;
        level = data.level;
        xp = data.xp;
        maxxp = PROGRESSION[level].xp;

        hud.updateHUD(user.stats());
        taskManager.load(data.time, data.activeTasks);
        return data;
    };

    this.writeSave = async (username, data) => {
        const response = await fetch(`${SERVER_PATH}/${username}`, {
            method: "PUT",
            mode: "no-cors",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        console.log(json);
    };

    this.getLevel = () => {
        return level;
    }

    this.setLevel = (value) => {
        level = value;
        maxxp = PROGRESSION[level].xp;
    }

    this.increaseXP = (value) => {
        xp += value;

        if (xp >= maxxp && level < CONFIG.maxLevel) {
            this.levelUp();
        } else {
            hud.updateHUD(this.stats());
        }

    }

    this.levelUp = () => {
        var oldXP = xp;
        var oldMaxXP = maxxp;

        do {
            xp -= maxxp
            this.setLevel(level + 1);
        } while (xp >= maxxp)

        hud.updateHUD({
            level: level,
            xp: oldXP,
            maxxp: oldMaxXP
        });

        hud.levelUp();
        map.updateVisbility();
    }

    this.stats = () => {
        return {
            level: level,
            xp: xp,
            maxxp: maxxp
        }
    };
}

function TaskManager() {
    _overlay = document.getElementById("overlay");
    _taskWindow = document.getElementById("taskWindow");

    var day;
    var time;
    var lastTaskCreatedTime;
    var lastTaskCheckTime;
    var lastEventCreatedTime;
    var lastEventCheckTime;
    var clock;

    var availableTasks;
    var activeTasks;
    var activeScenario;
    var taskInProgress = false;

    this.load = (timestamp, active) => {
        day = timestamp[0];
        time = timestamp[1];
        availableTasks = RANDOM_TASKS;
        activeTasks = active;
    }

    this.addTask = (task) => {
        var index = availableTasks.indexOf(task);
        availableTasks.splice(index, 1);
        activeTasks.push(task);
        map.getLocation(task.locationID).addTask(task);
    }

    this.removeTask = (task) => {
        var index = activeTasks.indexOf(task);
        activeTasks.splice(index, 1);

        // only readd random tasks
        if (task.id) {
            availableTasks.push(task);
        }

        map.getLocation(task.locationID).removeTask(task);
    }

    this.startTask = (task) => {
        if (taskInProgress) {
            return;
        }

        taskInProgress = true;

        if (task.content.type == "text") {
            _taskWindow.textContent = task.content.text;
        }

        _overlay.classList.remove("hidden");

        _taskWindow.addEventListener("click", () => {
            this.finishTask(task);
        });
    }

    this.finishTask = (task) => {
        user.increaseXP(task.xp);
        this.removeTask(task);
        taskInProgress = false;
        _overlay.classList.add("hidden");
    }

    this.tryGenerateTask = () => {
        if (availableTasks.length == 0) {
            return;
        }

        var index = Math.floor(Math.random() * RANDOM_TASKS.length);
        var task = RANDOM_TASKS[index];

        if (Math.random() <= task.probability) {
            this.addTask(task);
            lastTaskCreatedTime = time;
        }
    }

    this.tryGenerateEvent = () => {
        var index = Math.floor(Math.random() * EVENTS.length);
        var event = EVENTS[index];

        if (Math.random() <= event.probability) {
            hud.showMessage(event.message);

            for (let i = 0; i < event.tasks.length; i++) {
                this.addTask(event.tasks[i]);
            }

            lastEventCreatedTime = time;
        }
    }

    this.startScenario = (scenario) => {
        activeScenario = scenario;
    }

    this.endScenario = () => {
        activeScenario = null;
    }

    this.startDay = () => {
        lastTaskCreatedTime = -CONFIG.dayLength;
        lastTaskCheckTime = -CONFIG.dayLength;
        lastEventCreatedTime = -CONFIG.dayLength;
        lastEventCheckTime = -CONFIG.dayLength;

        for (let i = 0; i < SCENARIOS.length; i++) {
            var scenario = SCENARIOS[i]

            if (day == scenario.startDay) {
                this.startScenario(scenario);
            }
        }

        clock = setInterval(this.tick, 1000);
    }

    this.pauseDay = () => {
        clearInterval(clock);
    }

    this.finishDay = () => {
        for (let i = activeTasks.length - 1; i >= 0; i--) {
            var task = activeTasks[i];
            
            if (task.duration[0] == 0) {
                this.removeTask(task);
            }
        }

        if (scenario && day == scenario.endDay) {
            this.endScenario(activeScenario);
        }
    }

    this.tick = () => {
        time += 1;

        // Day over
        if (time >= CONFIG.dayLength) {
            clearTimeout(clock);
            this.finishDay();
            return;
        }
        
        // can generate random task?
        if (time - lastTaskCreatedTime >= CONFIG.taskGenerateCooldown && time - lastTaskCheckTime >= CONFIG.taskGenerateInterval) {
            lastTaskCheckTime = time;
            this.tryGenerateTask();
        }

        // can generate event?
        if (time - lastEventCreatedTime >= CONFIG.eventGenerateCooldown && time - lastEventCheckTime >= CONFIG.eventGenerateInterval) {
            lastEventCheckTime = time;
            this.tryGenerateEvent();
        }
    }
}

function HUD() {
    const LEVEL_COLORS = ["white", "antiquewhite", "darkseagreen", "cadetblue", "salmon"];

    var _level = document.getElementById("level");
    var _xp_meter = document.getElementById("xp_meter");
    var _xp_value = document.getElementById("xp_value");
    var _message = document.getElementById("message");

    this.updateHUD = (stats) => {
        _level.textContent = stats.level;
        _level.style.backgroundColor = LEVEL_COLORS[stats.level];
        _xp_meter.style.backgroundSize = `${stats.xp / stats.maxxp * 100}%`;
        _xp_value.textContent = `${stats.xp} / ${stats.maxxp} xp`;
    };

    this.levelUp = () => {
        _level.classList.add("level-up");

        setTimeout(() => {
            _level.classList.remove("level-up");
            hud.updateHUD(user.stats());
        }, LEVEL_UP_DURATION);
    }

    this.showMessage = (message) => {
        _message.textContent = message;
        _message.classList.remove("hidden");

        window.requestAnimationFrame(() => {
            setTimeout(() => {
                _message.classList.remove("slide-in");
            }, 0);
        });

        setTimeout(() => {
            this.hideMessage(SLIDE_IN_DURATION);
        }, MESSAGE_TIMEOUT);
    };

    this.hideMessage = (timeout) => {
        _message.classList.add("slide-in");

        setTimeout(() => {
            _message.classList.add("hidden");
        }, timeout)
    }
}

var map = new Map();
var user = new User();
var hud = new HUD();
var taskManager = new TaskManager();

// Load game
user.readSave("user0").then(() => {
    map.load();
    taskManager.startDay();
});