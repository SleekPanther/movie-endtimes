let getDurationInMinutes = runtime => {
	if (typeof (runtime) === 'string') {
		let parts = []
		if (runtime.includes(':')) {
			parts = runtime.split(':');
		} else if (runtime.includes('.')) {
			parts = runtime.split('.');
		}
		return 60 * parts[0] + Number(parts[1]);	//assume we always have hour:minutes & no more
	}
	else if (runtime < 10 && runtime % 1 === 0) {		//check if it doesn't contain a decimal, whole number hours
		return 60 * runtime;
	}
	else if (runtime % 1 === 0) {		//already in minutes
		return runtime;
	}
	let minutes = 60 * Math.floor(runtime) + (runtime - Math.floor(runtime)) * 100;	//simple time conversion hack. Assume 1.22 means 1 hr & 22 mins
	return minutes;
}

let stringToDate = str => {
	if (str instanceof Date) return str;
	if (str.includes('.')) {
		let hourAndMinute = str.split('.')
		str = hourAndMinute[0] + ':' + hourAndMinute[1]
	}
	return new Date(`January 1 2023 ${str}`)	//date part doesn't matter
}

const to24HourTime = str => {
	let date = typeof (str) === 'string' ? stringToDate(str) : str;
	if (date.getHours() < 12) {
		date.setHours(date.getHours() + 12)
	}
	return date;
}

const sanitizeInput = (showtimes) => {
	let newShowtimes = [showtimes[0], showtimes[1]];    //first copy duration & title = showtimes.map((s, i) => i > 0 ? s.trim() : s)
	for (let i = 2; i < showtimes.length; i++) {    //skip duration & title
		let times = showtimes[i].split(/\s+/);   //split on whitespace which trims & removed empty entries
		for (let time of times) {
			newShowtimes.push(time)
		}
	}
	return newShowtimes;
}

let getMovieEndTimes = showtimes => {
	let durationInMinutes = getDurationInMinutes(showtimes[0]);
	let endTimes = []
	for (let i = 2; i < showtimes.length; i++) {		//skip runtime & title
		let startTime = to24HourTime(showtimes[i]);
		startTime.setMinutes(startTime.getMinutes() + durationInMinutes);	//mutate
		endTimes.push(startTime)
	}
	return endTimes;
}

let showtimes1 = sanitizeInput([113, 'priscilla', '3:15', '6:00'])
let showtimes2 = sanitizeInput([105, 'Marvels', '3.25  6:15'])

let endTimes1 = getMovieEndTimes(showtimes1)
let endTimes2 = getMovieEndTimes(showtimes2)
console.log('End times 1:', endTimes1)
console.log('End times 2:', endTimes2)

// console.log(getDurationInMinutes(1.22))
// console.log(getDurationInMinutes(2.22))
// console.log(getDurationInMinutes(1.40))
// console.log(getDurationInMinutes(2.10))
// console.log(getDurationInMinutes(90))
// console.log(getDurationInMinutes('1:30'))
// console.log(getDurationInMinutes('2:10'))

let getSmallestDiff = (showtimes1, endTimes1, showtimes2, endTimes2) => {
	//Skip runtime & title
	showtimes1 = showtimes1.map((s, i) => i > 1 ? to24HourTime(s) : s)
	showtimes2 = showtimes2.map((s, i) => i > 1 ? to24HourTime(s) : s)
	let gap1to2 = []
	let gap2to1 = []
	for (let i = 0; i < endTimes1.length - 1; i++) {
		//i+3 to skip duration & title and get NEXT showtime
		console.log(`showtimes2 ${showtimes2[i + 3]} end ${endTimes1[i]}`)
		console.log(Math.floor((showtimes2[i + 3] - endTimes1[i]) / 1000) / 60)
		gap1to2.push(Math.floor((showtimes2[i + 3] - endTimes1[i]) / 1000) / 60)		//1000 for ms to seconds, then 60 for seconds to minutes
		gap2to1.push(Math.floor((showtimes1[i + 3] - endTimes2[i]) / 1000) / 60)
	}
	let min1To2 = Math.min(...gap1to2.filter(x => !isNaN(x) && x > 0));
	let min2To1 = Math.min(...gap2to1.filter(x => !isNaN(x) && x > 0));
	console.log('gap1to2', gap1to2, `Min = ${min1To2}`);
	console.log('gap2to1', gap2to1, `Min = ${min2To1}`);
	if (min1To2 <= min2To1) {
		console.log(`See movie ${showtimes1[1]} first, smallest gap ${min1To2}`)
	}
	else {
		console.log(`See movie ${showtimes2[1]} first, smallest gap ${min2To1}`)
	}
}
getSmallestDiff(showtimes1, endTimes1, showtimes2, endTimes2)