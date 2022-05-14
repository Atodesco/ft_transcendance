import {
	Routes,
	Route,
	BrowserRouter,
	Outlet,
	Navigate,
} from "react-router-dom";
import Chat from "./pages/Chat/Chat";
import Profile from "./pages/Profile/Profile";
import Credits from "./pages/Credits";
import Friendlist from "./pages/Friendlist/Friendlist";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Login from "./pages/Login";
import PlayGame from "./pages/PlayGame";
import Settings from "./pages/Settings";
import NavBar from "./components/NavBar";
import Cookies from "js-cookie";
import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import TheGame from "./pages/TheGame/TheGame";

let tet: any;

export const context = createContext(tet);

function App() {
	const p = { ini: 1 };

	const [userInfo, setUserInfo] = useState<any>();
	const [ws, setWs] = useState<any>(p);
	const [ready, setReady] = useState(false);

	const ProtectedRoutes = () => {
		return (
			<>
				{Cookies.get("token") !== undefined ? (
					<Outlet />
				) : (
					<Navigate replace to="/Login" />
				)}
			</>
		);
	};
	const DefaultRoutes = () => {
		return (
			<div>
				<NavBar />
				<Routes>
					<Route path="/" element={<ProtectedRoutes />}>
						<Route path="/PlayGame" element={<PlayGame />} />
						<Route path="/TheGame" element={<TheGame />} />
						<Route path="/Profile" element={<Profile />} />
						<Route path="/Profile/:id" element={<Profile />} />
						<Route path="/Leaderboard" element={<Leaderboard />} />
						<Route path="/Friendlist" element={<Friendlist />} />
						<Route path="/Chat" element={<Chat />} />
						<Route path="/Credits" element={<Credits />} />
						{/* DANS SETTINGS IL Y AURA LOGOUT*/}
						<Route path="/Settings" element={<Settings />} />
						<Route path="/" element={<Navigate replace to="/Profile" />} />
						<Route path="*" element={<div>404</div>} />
					</Route>
				</Routes>
			</div>
		);
	};
	// get the jwt token from the url and put it into a cookie
	if (Cookies.get("token") === undefined) {
		const params = new URLSearchParams(window.location.search);
		const paramValue = params.get("code");
		if (paramValue !== null) {
			Cookies.set("token", paramValue, { expires: 1 });
			window.location.href = window.location.href.split("?")[0];
		}
	}

	const getUserInfo = async () => {
		const myData = await fetch(
			process.env.REACT_APP_BACK_URL +
				":" +
				process.env.REACT_APP_BACK_PORT +
				"/user/me/",
			{
				credentials: "include",
			}
		);
		setUserInfo(await myData.json());
	};

	useEffect(() => {
		if (userInfo && userInfo.ft_id && ws.ini) {
			setWs(
				io(
					process.env.REACT_APP_BACK_URL +
						":" +
						process.env.REACT_APP_BACK_PORT +
						"?ft_id=" +
						userInfo.ft_id
				)
			);
		}
	}, [userInfo]);

	useEffect(() => {
		// setContext(createContext(ws));
		setReady(true);
	}, [ws]);

	useEffect(() => {
		if (Cookies.get("token") !== undefined) {
			getUserInfo();
		}
	}, []);

	return (
		<>
			{ready && (
				<BrowserRouter>
					<context.Provider value={ws}>
						<Routes>
							<Route path="/Login" element={<Login />} />
							<Route path="/TheGame" element={<TheGame />} />
							<Route path="*" element={<DefaultRoutes />} />
						</Routes>
					</context.Provider>
				</BrowserRouter>
			)}
		</>
	);
}

export default App;
