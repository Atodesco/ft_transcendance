import { useEffect, useState } from "react";
import Profiles from "./profile";

export default function Leaderboard() {
  let filteredData: any = [{ username: "", elo: "", status: "" }];
  const [rankData, setRankData] = useState(filteredData);
  const getData = async () => {
    const rawData = await fetch(
      process.env.REACT_APP_BACK_URL +
        ":" +
        process.env.REACT_APP_BACK_PORT +
        "/user/",
      {
        credentials: "include",
      }
    );
    const alldata = await rawData.json();
    console.log(alldata);

    alldata.sort((a: { elo: number }, b: { elo: number }) => {
      if (a.elo === b.elo) {
        return b.elo - a.elo;
      } else {
        return b.elo - a.elo;
      }
    });
    setRankData(alldata);
    testElo();
  };

  useEffect(() => {
    getData();
  }, []);

  const testElo = async () => {
    const rawData = await fetch("http://localhost:3000/user/me", {
      credentials: "include",
    });
    const data = await rawData.json();
    fetch("http://localhost:3000/user/" + data.ft_id + "/setElo/1950", {
      credentials: "include",
    });
  };

  return <Profiles Leaderboard={rankData} />;
}
