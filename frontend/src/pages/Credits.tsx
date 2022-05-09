import Button from "../components/Button";
import styles from "../css/Credits.module.css";

export default function Credits() {
  return (
    <div>
      Credits
      <button
        onClick={async () => {
          const username = await fetch("http://localhost:3000/user/", {
            credentials: "include",
          });
          const data = await username.json();
          console.log(data);
        }}
      >
        CLICK
      </button>
    </div>
  );
}
