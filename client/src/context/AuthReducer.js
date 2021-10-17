const AuthReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN_START":
			return {
				user: null,
				isFetching: true,
				error: false,
			};
		case "LOGIN_SUCCESS":
			return {
				user: action.payload,
				isFetching: false,
				error: false,
			};
		case "LOGIN_FAILURE":
			return {
				user: null,
				isFetching: false,
				error: true,
			};
		case "FOLLOW":
			return {
				...state,
				user: {
					...state.user,
					followings: [...state.user.followings, action.payload],
				},
			};
		case "UNFOLLOW":
			return {
				...state,
				user: {
					...state.user,
					followings: state.user.followings.filter(
						(following) => following !== action.payload
					),
				},
			};
		case "UPLOAD":
			return {
				...state,
				user: {
					...state.user,
					profilePicture: action.payload,
				},
			};
		case "UPDATE":
			return {
				...state,
				user: {
					...state.user,
					desc: action.payload.desc,
					city: action.payload.city,
					from: action.payload.from,
					relationship: action.payload.relationship,
					profilePicture: action.payload.profilePicture,
					coverPicture: action.payload.coverPicture,
					isFirstTime: action.payload.isFirstTime,
				},
			};
		default:
			return state;
	}
};

export default AuthReducer;
