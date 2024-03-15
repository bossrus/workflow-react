const URGENCY_COLORS = {
	URGENT: '#f78085',
	HIGH_PRIORITY: '#f9a0a2',
	MEDIUM_PRIORITY: '#fbc0c0',
	LOW_PRIORITY: '#fddfdf',
	VERY_LOW_PRIORITY: '#fcefef',
	NO_URGENT: '#fff',
};

export const assignColor = (urgency: number) => {
	if (urgency <= 151840) {
		return URGENCY_COLORS.NO_URGENT;
	} else if (urgency <= 203680) {
		return URGENCY_COLORS.VERY_LOW_PRIORITY;
	} else if (urgency <= 255520) {
		return URGENCY_COLORS.LOW_PRIORITY;
	} else if (urgency <= 307360) {
		return URGENCY_COLORS.MEDIUM_PRIORITY;
	} else if (urgency <= 359200) {
		return URGENCY_COLORS.HIGH_PRIORITY;
	} else {
		return URGENCY_COLORS.URGENT;
	}
};