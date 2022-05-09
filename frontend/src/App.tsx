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

function App() {
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
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/Login" element={<Login />} />
				<Route path="*" element={<DefaultRoutes />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
