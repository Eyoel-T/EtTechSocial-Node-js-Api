import React from "react";
import {
	Box,
	Menu,
	MenuItem,
	Divider,
	IconButton,
	Tooltip,
	ListItemIcon,
} from "@material-ui/core";
import "./avatar.css";

import { PersonAdd, Settings, ExitToApp, Cancel } from "@material-ui/icons";

import { Link } from "react-router-dom";

export default function AccountMenu(props) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	function handleLogout() {
		localStorage.clear();
		window.location.reload();
	}
	return (
		<React.Fragment>
			<Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
				<Tooltip title="Account settings">
					<IconButton onClick={handleClick}>
						<img className="topbarImg" src={props.src} alt="" />
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				transformOrigin={{ horizontal: "left", vertical: "top" }}
				anchorOrigin={{ horizontal: "top", vertical: "bottom" }}
			>
				<MenuItem>
					<Link
						to={`/profile/${props.username}`}
						style={{ textDecoration: "none", color: "black" }}
					>
						<div className="avatarWrapper">
							<img className="topbarImg" src={props.src} alt="" />
							<span>Profile</span>
						</div>
					</Link>

					<Cancel
						style={{ position: "absolute", left: "80%", top: "10%" }}
						className="avatar"
					/>
				</MenuItem>

				<Divider />
				<Link to="/register" style={{ textDecoration: "none", color: "black" }}>
					<MenuItem>
						<ListItemIcon>
							<PersonAdd fontSize="small" />
						</ListItemIcon>
						Add another account
					</MenuItem>
				</Link>
				<Link
					to={"/setting/" + props.username}
					style={{ textDecoration: "none", color: " black" }}
				>
					<MenuItem>
						<ListItemIcon>
							<Settings fontSize="small" />
						</ListItemIcon>
						Settings
					</MenuItem>
				</Link>

				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<ExitToApp fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}
