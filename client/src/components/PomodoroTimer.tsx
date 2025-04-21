import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export default function PomodoroTimer() {
  // “mode” is either 'work' or 'break'
  const [mode, setMode] = useState<'work'|'break'>('work');
  // User-defined durations
  const [workMinutesState, setWorkMinutesState] = useState<number>(WORK_MINUTES);
  const [breakMinutesState, setBreakMinutesState] = useState<number>(BREAK_MINUTES);
  // seconds remaining
  const [secondsLeft, setSecondsLeft] = useState(workMinutesState * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number>();
  
  // Lofi YouTube audio (replace VIDEO_ID with your chosen track)
  const ytUrl = 'https://www.youtube.com/watch?v=sF80I-TQiW0&ab_channel=TheJapaneseTown';

  // Tick every second when running
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft(s => s - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // When timer hits zero, switch modes
  useEffect(() => {
    if (secondsLeft < 0) {
      const nextMode = mode === 'work' ? 'break' : 'work';
      const nextSeconds = (nextMode === 'work' ? workMinutesState : breakMinutesState) * 60;
      setMode(nextMode);
      setSecondsLeft(nextSeconds);
      // optional: fire a browser notification or play a sound
      new Notification(
        nextMode === 'work' ? 'Time to focus!' : 'Take a break!'
      );
    }
  }, [secondsLeft, mode]);

  // Helpers
  const start = () => {
    setIsRunning(true);
    // request notification permission if needed
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setMode('work');
    setSecondsLeft(workMinutesState * 60);
  };

  // Format MM:SS
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="p-8 max-w-sm mx-auto text-center bg-white rounded shadow">
      <div className="mb-4 flex space-x-4 justify-center">
        <label className="flex items-center space-x-2">
          <span>Work (min):</span>
          <input
            type="number"
            min="1"
            className="w-16 p-1 border rounded"
            value={workMinutesState}
            onChange={e => setWorkMinutesState(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center space-x-2">
          <span>Break (min):</span>
          <input
            type="number"
            min="1"
            className="w-16 p-1 border rounded"
            value={breakMinutesState}
            onChange={e => setBreakMinutesState(Number(e.target.value))}
          />
        </label>
      </div>
      <h2 className="text-xl mb-4">{mode === 'work' ? 'Work' : 'Break'}</h2>
      <div className="text-5xl font-mono mb-4">{minutes}:{seconds}</div>
      <div className="space-x-4">
        {!isRunning 
          ? <button onClick={start} className="px-4 py-2 bg-green-500 text-white rounded">Start</button>
          : <button onClick={pause} className="px-4 py-2 bg-yellow-500 text-white rounded">Pause</button>
        }
        <button onClick={reset} className="px-4 py-2 bg-red-500 text-white rounded">Reset</button>
      </div>
      {/* Hidden YouTube audio player */}
      <ReactPlayer
        url={ytUrl}
        playing={isRunning}
        loop
        muted={false}
        volume={0.5}
        width="0"
        height="0"
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              controls: 0,
              disablekb: 1,
              showinfo: 0,
              autoplay: 1,
              playlist: 'sF80I-TQiW0'
            }
          }
        }}
      />
    </div>
  );
}