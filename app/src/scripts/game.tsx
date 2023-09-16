import config from '../game_data/config.json';

export interface Player {
    name: string;
    level: number;
    xp: number;
}

export interface LevelProgression {
    xp: number;
    locations: string[];
}

export interface Task {
    id: number;
    buildingID: string;
    probability: number;
    description: string;
    xp: number;
    content: object;
}

export interface Event {
    id: string;
    description: string;
    tasks: Task[];
}

export interface Scenario {
    id: string;
    day: number;
    description: string;
    tasks: Task[];
}

export interface Timestamp {
    day: number;
    ticks: number;
}

export class TaskManager {
    availableTasks: Task[];
    activeTasks: Task[] = [];

    constructor(tasks: Task[]) {
        this.availableTasks = tasks;
    }

    addTask(task: Task) {
        this.activeTasks.push(task);
    }

    removeTask(task: Task) {
        
    }

    clear() {

    }
}

export class TimeSystem {
    timeDiff(t1: Timestamp, t2: Timestamp) {
        return config.dayLength * (t1.day - t2.day) + t1.ticks - t2.ticks;
    }
}