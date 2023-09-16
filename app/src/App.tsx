import React, { useEffect } from 'react';
import { Component, useState } from 'react';
import { IntervalTimer } from './scripts/lib';
import { Player, Task, LevelProgression, Timestamp } from './scripts/game';

import config from './game_data/config.json';
import map from './game_data/map.json';
import progression from './game_data/progression.json';
import randomTasks from './game_data/random_tasks.json';
import scheduled_tasks from './game_data/scheduled_tasks.json';
import events from './game_data/events.json';
import scenarios from './game_data/scenarios.json';

import LevelIndicator from './components/LevelIndicator';
import Message from './components/Message';
import StatusBar from './components/StatusBar';
import Map from './components/Map';

function App() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(-1);
  const [XP, setXP] = useState(-1);
  const [day, setDay] = useState(-1);
  const [time, setTime] = useState(-1);
  const [activeTasks, setActiveTasks] = useState();

  var lastTaskCreated: Timestamp;
  var lastEventCreated: Timestamp;
  var lastScenarioCreated: Timestamp;

  const readSave = async (username: string) => {
    const response = await fetch(`/${username}`);
    return await response.json();
  }

  const writeSave = async (username: string, data: object) => {
    const response = await fetch(`/${username}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  const currentTime = () => {
    return { day: day, ticks: time };
  }

  const tick = () => {
    var current = currentTime();
  }

  const createTask = () => {

  }

  const acceptTask = () => {

  }

  const startDay = () => {
    clock = new IntervalTimer(config.dayLength - time, 1, tick, endDay);
  }

  const endDay = () => {
    console.log("Day over");
  }

  const startGame = () => {
    clock.start();
  }

  var clock: IntervalTimer;

  useEffect(() => {
    readSave("user0").then((data) => {
      setName(data.name);
      setLevel(data.level);
      setXP(data.xp);
      setDay(data.currentTime[0]);
      setTime(data.currentTime[1]);
      lastTaskCreated = { day: data.lastTaskCreated[0], ticks: data.lastTaskCreated[1] };
      lastEventCreated = { day: data.lastEventCreated[0], ticks: data.lastEventCreated[1] };
      lastScenarioCreated = { day: data.lastScenarioCreated[0], ticks: data.lastScenarioCreated[1] };

      startGame();
    });
  });

  return (
    <>
      <Map />
      {level != -1 &&
        <div className="hud">
          <LevelIndicator value={level} />
          <StatusBar XP={XP} maxXP={progression[level - 1].xp} />
        </div>}
      <Message />
    </>
  );
}

export default App;