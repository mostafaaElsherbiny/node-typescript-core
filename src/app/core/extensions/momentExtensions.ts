import moment from 'moment';

export interface RangeInterface {
	startDate: Date;
	endDate: Date;
}
export const generateWeeksByRange = (startDate: Date, endDate: Date): RangeInterface[] => {
	let weeks = [];
	let start = moment(startDate);
	const daysUntilMonday = (start.day() + 7 - 1) % 7;

	start = start.clone().subtract(daysUntilMonday === 0 ? 7 : daysUntilMonday, 'days');

	if (start.day() !== 1) {
		start = start.startOf('week').add(1, 'days');
	}
	let end = moment(endDate);
	while (start <= end) {
		weeks.push({
			startDate: start.format('YYYY-MM-DD'),
			endDate: start.add(6, 'days').format('YYYY-MM-DD'),
		});
		start = start.add(1, 'days');
	}
	return weeks;
};
// console.log(generateWeeksByRange(new Date('2023-05-02'), new Date('2023-05-31')));
