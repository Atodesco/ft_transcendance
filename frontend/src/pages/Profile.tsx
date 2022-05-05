import styles from "../css/Profile.module.css"



export default function Profile() {
	console.log("url: ", window.location.href);
	const params = new URLSearchParams(window.location.search);
	const paramValue = params.get("code");
	console.log("paramValue: ", paramValue);
  return (
	<div>Profile</div>
  )
}
