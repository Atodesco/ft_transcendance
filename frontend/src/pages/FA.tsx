import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { context } from "../App";

export default function FA({ ready }: any) {
	const navigate = useNavigate();
	const ws = useContext(context);

	if (Cookies.get("token") === undefined) {
		navigate("/Login");
	} else if (!sessionStorage.getItem("2FA")) {
		sessionStorage.setItem("2FA", "true");
	}

	useEffect(() => {
		if (ready) {
		}
	}, [ready]);

	return <div>FA</div>;
}
