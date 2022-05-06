import {
	Routes,
	Route,
	BrowserRouter,
	Outlet,
	Navigate,
} from "react-router-dom";
import Chat from "./pages/Chat";
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
					<Navigate replace to="/" />
				)}
			</>
		);
	};
	const DefaultRoutes = () => {
		return (
			<div>
				<NavBar />
				<Routes>
					{/* <Route path="*" element={<ProtectedRoutes />}> */}
					<Route path="/PlayGame" element={<PlayGame />} />
					<Route path="/Profile" element={<Profile />} />
					<Route path="/Leaderboard" element={<Leaderboard />} />
					<Route path="/Friendlist" element={<Friendlist />} />
					<Route path="/Chat" element={<Chat />} />
					<Route path="/Credits" element={<Credits />} />
					{/* DANS SETTINGS IL Y AURA LOGOUT*/}
					<Route path="/Settings" element={<Settings />} />
					<Route path="*" element={<div>404</div>} />
					{/* </Route> */}
				</Routes>
			</div>
		);
	};
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="*" element={<DefaultRoutes />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
