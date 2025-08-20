export const formatPostDate = (createdAt) => {
	const currentDate = new Date();
	const createdAtDate = new Date(createdAt);

	const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
	const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
	const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
	const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

	if (timeDifferenceInDays > 1) {
		return createdAtDate.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		}); // Example: Apr 25, 2024
	} else if (timeDifferenceInDays === 1) {
		return "1d";
	} else if (timeDifferenceInHours >= 1) {
		return `${timeDifferenceInHours}h`;
	} else if (timeDifferenceInMinutes >= 1) {
		return `${timeDifferenceInMinutes}m`;
	} else {
		return "Just now";
	}
};

export const formatMemberSinceDate = (createdAt) => {
	const currentDate = new Date();
	const createdDate = new Date(createdAt);

	let yearDifference = currentDate.getFullYear() - createdDate.getFullYear();
	const monthDifference = currentDate.getMonth() - createdDate.getMonth();

	// Adjust if the user hasn't completed the full year yet
	if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < createdDate.getDate())) {
		yearDifference--;
	}

	if (yearDifference <= 0) {
		return "Joined less than a year ago";
	} else if (yearDifference === 1) {
		return "Joined 1 year ago";
	} else {
		return `Joined ${yearDifference} years ago`;
	}
};

export const formatFullDate = (createdAt) => {
	const date = new Date(createdAt);
	return date.toISOString().split("T")[0]; // Returns in format YYYY-MM-DD
};
