import Profiles from "../Leaderboard/profile";
import { Data } from "../Leaderboard/database";

interface Props {
	input: string;
}

function List(props: Props) {
	//create a new array by filtering the original array
	const filteredData = Data.filter((el) => {
		//if no input the return the original
		if (props.input === "") {
			return el;
		}
		//return the item which contains the user input
		else {
			return el.name.toLowerCase().includes(props.input);
		}
	});
	return <Profiles Leaderboard={filteredData} />;
}

export default List;
