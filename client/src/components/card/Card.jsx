import "./card.css";

export default function Share(props) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	return (
		<div className="share1">
			<div className="shareWrapper1">
				<div className="shareTop1">
					<img className="shareProfileImg1" src={PF + props.src} alt="" />
					<input placeholder={props.name} className="shareInput1" />
				</div>
				<hr className="shareHr1" />
				<div className="followInfo">
					<span className="followValue">{"followers " + props.followers}</span>
					<span className="followValue">
						{"followings " + props.followings}
					</span>
				</div>
			</div>
		</div>
	);
}
