
"use client";
import React from "react";
import NavComp from '../../components/NavComp';
import PomodoroTimer from "./components/Pomodoro";
export default function Pomodoro() {
  return (
    <div>
        <NavComp></NavComp>
      <h1>Pomodoro Timer</h1>
      <PomodoroTimer></PomodoroTimer>
    </div>
  );
}
