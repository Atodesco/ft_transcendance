import { useEffect, useState } from "react";
import styles from "../../css/Profile.module.css";
import Button from "../../components/Button";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faMessage,
  faBan,
  faRankingStar,
} from "@fortawesome/free-solid-svg-icons";

import ProgressBar from "react-animated-progress-bar";
import { PieChart } from "react-minimal-pie-chart";

import Profiles from "./Users";
import { useParams } from "react-router";

interface OtherUser {
  ft_id: number;
  username: string;
  status: string;
  friend: boolean;
  blocked: boolean;
  picture: string;
}

interface User {
  ft_id: number;
  username: string;
  status: string;
  friends: number[];
  blocked: number[];
  picture: string;
  win: number;
  lose: number;
  currentLevel: number;
  nextLevel: number;
  levelProgress: number;
  elo: number;
}

interface History {
  username: string;
  score: string;
  win: boolean;
}

const history: History[] = [
  { username: "Rledrin", score: "5:7", win: false },
  { username: "Atodesco", score: "7:0", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
  { username: "Jake", score: "7:1", win: true },
];

export default function Profile() {
  const Var: any = {};
  const aVar: any = [{}];
  const [inputText, setInputText] = useState("");
  const [myData, setMyData] = useState<User>({
    ft_id: 0,
    username: "",
    status: "",
    friends: [],
    blocked: [],
    picture: "",
    win: 0,
    lose: 0,
    currentLevel: 0,
    nextLevel: 1,
    levelProgress: 0,
    elo: 1000,
  });
  const [userData, setUserData] = useState<User>({
    ft_id: 0,
    username: "",
    status: "",
    friends: [],
    blocked: [],
    picture: "",
    win: 0,
    lose: 0,
    currentLevel: 0,
    nextLevel: 1,
    levelProgress: 0,
    elo: 1000,
  });
  const [users, setUsers] = useState(aVar);
  const [addFriend, setAddFriend] = useState(true);
  const [blockedUser, setBlockedUser] = useState(true);

  let inputHandler = (e: any) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const getMyData = async () => {
    const rawData = await fetch(
      process.env.REACT_APP_BACK_URL +
        ":" +
        process.env.REACT_APP_BACK_PORT +
        "/user/me/",
      {
        credentials: "include", //this is what I need to tell the browser to include cookies
      }
    );

    const data = await rawData.json();
    const user: User = {
      ft_id: data.ft_id,
      username: data.username,
      status: data.status,
      friends: data.friends,
      blocked: data.blocked,
      picture: data.picture,
      win: data.win,
      lose: data.lose,
      currentLevel: data.lvl / 100,
      nextLevel: data.lvl / 100 + 1,
      levelProgress: data.lvl % 100,
      elo: data.elo,
    };
    setMyData(user);
  };

  const filteredData = users.filter((el: any) => {
    if (el.ft_id !== myData.ft_id && el.ft_id !== userData.ft_id) {
      const friend = userData.friends
        ? userData.friends.includes(el.ft_id)
        : false;
      const block = userData.blocked
        ? userData.blocked.includes(el.ft_id)
        : false;
      let otherUser: OtherUser = {
        username: el.username,
        status: el.status,
        friend: friend,
        blocked: block,
        picture: el.picture,
        ft_id: el.ft_id,
      };
      if (inputText === "") {
        return otherUser;
      } else {
        if (el.username.toLowerCase().includes(inputText)) {
          return otherUser;
        }
      }
    }
  });

  const getData = async (id?: number) => {
    let link =
      process.env.REACT_APP_BACK_URL +
      ":" +
      process.env.REACT_APP_BACK_PORT +
      "/user/";
    link += id ? id : "me";
    const rawData = await fetch(link, {
      credentials: "include",
    });

    const data = await rawData.json();
    const user: User = {
      ft_id: data.ft_id,
      username: data.username,
      status: data.status,
      friends: data.friends,
      blocked: data.blocked,
      picture: data.picture,
      win: data.win,
      lose: data.lose,
      currentLevel: data.lvl / 100,
      nextLevel: data.lvl / 100 + 1,
      levelProgress: data.lvl % 100,
      elo: data.elo,
    };
    setUserData(user);
    link =
      process.env.REACT_APP_BACK_URL +
      ":" +
      process.env.REACT_APP_BACK_PORT +
      "/user/";
    const rawData2 = await fetch(link, {
      credentials: "include", //this is what I need to tell the browser to include cookies
    });
    const data2 = await rawData2.json();
    setUsers(data2);
    getMyData();
  };

  const { id } = useParams();
  useEffect(() => {
    getData(Number(id));
  }, [id]);
  useEffect(() => {
    setAddFriend(
      myData.friends && myData.friends.length > 0
        ? !myData.friends.includes(userData.ft_id)
        : true
    );
    setBlockedUser(
      myData.blocked && myData.blocked.length > 0
        ? !myData.blocked.includes(userData.ft_id)
        : true
    );
  }, [myData]);

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <img src={userData.picture} />
        <div className={styles.Infos}>
          <div>
            <h1>{userData.username}</h1>
            <h2>Status: {userData.status} </h2>
          </div>
          {id && (
            <div className={styles.Buttons}>
              <Button
                text={addFriend ? " Add user" : " Remove user"}
                onClick={() => {
                  const addOrRemove = addFriend
                    ? "/addFriend/"
                    : "/removeFriend/";
                  fetch(
                    process.env.REACT_APP_BACK_URL +
                      ":" +
                      process.env.REACT_APP_BACK_PORT +
                      "/user/" +
                      myData.ft_id +
                      addOrRemove +
                      id,
                    {
                      credentials: "include",
                    }
                  );
                  setAddFriend(!addFriend);
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} />
              </Button>
              <Button text="Chat">
                <FontAwesomeIcon icon={faMessage} />
              </Button>
              <Button
                text={blockedUser ? " Block user" : " Unblock user"}
                onClick={() => {
                  const blockOrUnblock = blockedUser
                    ? "/blockUser/"
                    : "/unblockUser/";
                  fetch(
                    process.env.REACT_APP_BACK_URL +
                      ":" +
                      process.env.REACT_APP_BACK_PORT +
                      "/user/" +
                      myData.ft_id +
                      blockOrUnblock +
                      id,
                    {
                      credentials: "include",
                    }
                  );
                  setBlockedUser(!blockedUser);
                }}
              >
                <FontAwesomeIcon icon={faBan} />
              </Button>
            </div>
          )}
        </div>
        <div className={styles.Stats}>
          <div className={styles.Rank}>
            <h2>Rank: 1 er</h2>
          </div>
          <div className={styles.LevelProgress}>
            <span>{userData.currentLevel}</span>
            <ProgressBar
              className={styles.Level}
              width="200px"
              height="10px"
              rect
              fontColor="gray"
              percentage={userData.levelProgress.toString()}
              rectPadding="1px"
              rectBorderRadius="20px"
              trackPathColor="transparent"
              bgColor="#333333"
              trackBorderColor="grey"
            />
            <span>{userData.nextLevel}</span>
          </div>

          <div className={styles.Ratio}>
            <PieChart
              lineWidth={60}
              label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
              labelPosition={100 - 60 / 2}
              labelStyle={{
                fill: "#fff",
                opacity: 0.75,
                pointerEvents: "none",
              }}
              data={[
                { title: "Win", value: userData.win, color: "green" },
                { title: "Lose", value: userData.lose, color: "red" },
              ]}
            />
          </div>
        </div>
      </div>
      <div className={styles.ProfileInfo}>
        <div className={styles.MatchHistory}>
          {history.map((item, index) => {
            let col = "red";
            if (item.win) {
              col = "green";
            }

            return (
              <div key={index} style={{ backgroundColor: col }}>
                {item.username} {item.score} {item.win}
              </div>
            );
          })}
        </div>

        <div className={styles.SearchBar}>
          <TextField
            className={styles.Search}
            variant="outlined"
            fullWidth
            label="Search"
            onChange={inputHandler}
          />
          <Profiles Data={filteredData} myData={myData} />
        </div>
      </div>
    </div>
  );
}
