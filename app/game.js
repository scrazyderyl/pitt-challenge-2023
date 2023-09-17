const SERVER_PATH = "http://localhost:4000";

function Game() {
    this.load = () => {
        user.readSave("user0").then(() => {
            setTimeout(() => {
                hud.showMessage("A car accident has been reported! First responders have been dispatched to the scene.");
            }, 16000)
        });
    }
}

function Map() {
    var _map = document.getElementById("map");

    var tiles = [];
    
    this.load = (level) => {
        var i = 1;

        for (; i <= level; i++) {
            var locations = PROGRESSION[i].locations;

            for (let j = 0; j < locations.length; j++) {
                var tile = new Tile(locations[j], false);
                _map.appendChild(tile.getElement());
                tiles.push(tile);
            }
        }

        for (; i <= CONFIG.maxLevel; i++) {
            var locations = PROGRESSION[i].locations;

            for (let j = 0; j < locations.length; j++) {
                var tile = new Tile(locations[j], true);
                _map.appendChild(tile.getElement());
                tiles.push(tile);
            }
        }
    };
}

function Tile(locationID, hidden) {
    var index = binarySearch(MAP.locations, locationID, (a, b) => a.localeCompare(b.id));
    var location = MAP.locations[index];
    var tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.left = `${location.x}px`;
    tile.style.top = `${location.y}px`;

    var alert = document.createElement("div");
    alert.classList.add("task-alert");
    alert.classList.add("hidden");
    alert.textContent = "!";
    tile.appendChild(alert);

    var icon = document.createElement("img");
    icon.src = `./assets/${location.id}.png`;
    icon.width = location.width;
    tile.appendChild(icon);

    if (hidden) {
        tile.classList.add("locked");
    }

    var tasks = []

    this.getElement = () => {
        return tile;
    }

    this.addTask = (task) => {
        if (tasks.length == 0) {
            this.showTaskAlert();
        }

        tasks.push(task);
    }

    this.removeTask = (task) => {
        if (tasks.length == 0) {
            this.hideTaskAlert();
        }

        tasks.splice(tasks.indexOf(task), 1);
    }

    this.showTaskAlert = () => {
        alert.classList.remove("hidden");
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
        map.load(level);
        taskManager.load(data.activeTasks);
        timeSystem.load(data.time, data.lastTaskCreated, data.lastEventCreated);
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
    var availableTasks = [];
    var activeTasks = [];

    this.load = (active) => {
        availableTasks = RANDOM_TASKS;
        activeTasks = active;
    }

    this.addTask = (task) => {
        activeTasks.push(task);

        var index = availableTasks.indexOf(task);
        availableTasks.splice(index, 1);
    }

    this.removeTask = (task) => {
        var index = activeTasks.indexOf(task);
        activeTasks.splice(index, 1);

        availableTasks.push(task);
    }

    this.startTask = (task) => {

    }

    this.finishTask = (task) => {
        
    }
}

function TimeSystem() {
    var day;
    var time;
    var lastTaskCreatedDay;
    var lastTaskCreatedTime;
    var lastEventCreatedDay;
    var lastEventCreatedTime;
    var timer;

    this.load = (current, lastTask, lastEvent) => {
        day = current[0];
        time = current[1];
        lastTaskCreatedDay = lastTask[0];
        lastTaskCreatedTime = lastTask[1];
        lastEventCreatedDay = lastEvent[0];
        lastEventCreatedTime = lastEvent[1];
    }

    this.startDay = () => {
        timer = setInterval(this.tick, 1000);
    }

    this.pauseDay = () => {
        clearInterval(timer);
    }

    this.tick = () => {
        time += 1;
        
        if (time >= CONFIG.dayLength) {
            this.dayFinished();
        }
    }

    this.dayFinished = () => {

    }

    this.timeDiff = (t1, t2) => {
        return CONFIG.dayLength * (t1[0] - t2[0]) + t1[1] - t2[1];
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

var game = new Game();
var map = new Map();
var user = new User();
var hud = new HUD();
var taskManager = new TaskManager();
var timeSystem = new TimeSystem();

game.load();