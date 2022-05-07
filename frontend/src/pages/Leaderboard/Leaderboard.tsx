import styles from "../../css/Leaderboard.module.css";
import { useState } from "react";
import Profiles from "./profile";
import { Data } from "./database";

export default function Leaderboard() {
  const [period, setPeriod] = useState(0);

  const handleClick = (e: any) => {
    setPeriod(e.target.dataset.id);
  };

  return (
    <div className={styles.board}>
      <h1 className={styles.leaderboard}>Leaderboard</h1>

      <div className={styles.duration}>
        <button onClick={handleClick} data-id="7">
          7 Days
        </button>
        <button onClick={handleClick} data-id="30">
          30 Days
        </button>
        <button onClick={handleClick} data-id="0">
          All-Time
        </button>
      </div>

      <Profiles Leaderboard={between(Data, period)} />
    </div>
  );
}

function between(data: any[], between: number) {
  const today = new Date();
  const previous = new Date(today);
  previous.setDate(previous.getDate() - (between + 1));

  let filter = data.filter((val: { dt: string | number | Date }) => {
    let userDate = new Date(val.dt);
    if (between === 0) return val;
    return previous <= userDate && today >= userDate;
  });

  // sort with asending order
  return filter.sort((a: { score: number }, b: { score: number }) => {
    if (a.score === b.score) {
      return b.score - a.score;
    } else {
      return b.score - a.score;
    }
  });
}
