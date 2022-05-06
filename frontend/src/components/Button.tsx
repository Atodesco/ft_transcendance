import styles from "../css/Button.module.scss";

interface Props {
	text: string;
	className?: string;
	id?: string;
	onClick?: () => void;
	disabled?: boolean;
	children?: React.ReactNode;
}

export default function Button(props: Props) {
	return (
		<>
			<div id={props.id} className={`${styles.button2} ${props.className}`}>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				{props.children} {props.text}
			</div>
		</>
	);
}
