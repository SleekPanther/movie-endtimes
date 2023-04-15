let getDurationInMinutes = (runtime) => {
	if(typeof(runtime) === 'string' && runtime.includes(":")){
		let parts = runtime.split(":");
		return 60* parts[0] + Number(parts[1]);	//assume we always have hour:minutes & no more
	}
	else if(runtime % 1 === 0){		//check if it doesn't contain a decimal
		return runtime;
	}
	let minutes = 60 * Math.floor(runtime) + (runtime - Math.floor(runtime)) * 100;	//simple time conversion hack. Assume 1.22 means 1 hr & 22 mins
	return minutes;
}

let stringToDate = (str) => new Date(`January 1 2023 ${str}`)	//date part doesn't matter

let getMovieEndTimes = (showtimes) =>{
	let durationInMinutes = getDurationInMinutes(showtimes[0]);
	let endTimes = []
	for(let i=1; i< showtimes.length; i++){		//skip 0
		let startTime = stringToDate(showtimes[i]);
		startTime.setMinutes(startTime.getMinutes() + durationInMinutes);	//mutate
		endTimes.push(startTime)
	}
	return endTimes;
}

let showtimes1 = [1.33, '3:30',  '6:00',  '9:05']
let showtimes2 = [1.52, '3:10',  '6:10',  '8:45']
let endTimes1 = getMovieEndTimes(showtimes1)
let endTimes2 = getMovieEndTimes(showtimes2)
console.log('End times:', endTimes1)
console.log('End times:', endTimes2)

// console.log(getDurationInMinutes(1.22))
// console.log(getDurationInMinutes(2.22))
// console.log(getDurationInMinutes(1.40))
// console.log(getDurationInMinutes(2.10))
// console.log(getDurationInMinutes(90))
// console.log(getDurationInMinutes('1:30'))
// console.log(getDurationInMinutes('2:10'))

let getSmallestDiff = (showtimes1, endTimes1, showtimes2, endTimes2) =>{
	let gap1to2 = []
	let gap2to1 = []
	for(let i=0; i< endTimes1.length; i++){
		// console.log(`showtimes2 ${stringToDate(showtimes2[i+2])} end ${endTimes1[i]}`)	//offset by 2 since showtimes has runtime & want NEXT showtime
		// console.log( Math.floor((stringToDate(showtimes2[i+2]) - endTimes1[i] )/1000 )/60 )
		gap1to2.push(Math.floor((stringToDate(showtimes2[i+2]) - endTimes1[i] )/1000 )/60)		//1000 for ms to seconds, then 60 for seconds to minutes
		gap2to1.push(Math.floor((stringToDate(showtimes1[i+2]) - endTimes2[i] )/1000 )/60)
	}
	let min1To2 = Math.min(...gap1to2.filter(x => !isNaN(x)));
	let min2To1 = Math.min(...gap2to1.filter(x => !isNaN(x)));
	console.log(gap1to2, `Min = ${min1To2}`);
	console.log(gap2to1, `Min = ${min2To1}`);
	if(min1To2 <= min2To1){
		console.log(`See movie 1 first, smallest gap ${min1To2}`)
	}
	else{
		console.log(`See movie 2 first, smallest gap ${min2To1}`)
	}
}
getSmallestDiff(showtimes1, endTimes1, showtimes2, endTimes2)