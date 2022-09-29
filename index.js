function App() {
	const [displayTime, setDisplayTime] = React.useState(25 * 60)
	const [breakTime, setBreakTime] = React.useState(5 * 60)
	const [sessionTime, setSessionTime] = React.useState(25 * 60)
	const [timerOn, setTimerOn] = React.useState(false)
	const [onBreak, setOnBreak] = React.useState(false)
	const [breakAudio, setBreakAudio] = React.useState(new Audio("./breakTime.mp3"))
	
	const playBreakSound = () => {
		breakAudio.currentTime = 0
		breakAudio.play()
	}

	const formatTime = (time) => {
	let minutes = Math.floor(time / 60)
	let seconds = time % 60
	return (
	(minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
)
}

const changeTime = (amount, type) => {
	if(type == 'break') {
		if((breakTime <= 60 && amount < 0) || (breakTime >= (60 * 60) && amount >=0)) {
			return
		}
		setBreakTime((prev) => prev + amount)
	}
	else {
		if(sessionTime <= 60 && amount < 0 || (sessionTime >= (60 * 60) && amount >=0)) {
			return
		}
		setSessionTime((prev) => prev + amount)
		if(!timerOn) {
			setDisplayTime(sessionTime + amount)
		}
	}
}

const controlTime = () => {
	let second = 1000
	let date = new Date().getTime()
	let nextDate = new Date().getTime() + second
	let onBreakVariable = onBreak
	if(!timerOn) {
		let interval = setInterval(() => {
			date = new Date().getTime()
			if(date > nextDate) {
			setDisplayTime((prev) => {
			if(prev <= 0 && !onBreakVariable){
				playBreakSound()
				onBreakVariable = true
				setOnBreak(true)
				return breakTime
			}
			else if(prev <= 0 && onBreakVariable) {
				playBreakSound()
				onBreakVariable = false
				setOnBreak(false)
				return sessionTime
			}
			return prev - 1})
			nextDate += second
			}
		}, 30)
		localStorage.clear()
		localStorage.setItem("interval-id", interval)
	}
	if(timerOn) {
		clearInterval(localStorage.getItem("interval-id"))
	}
	setTimerOn(!timerOn)
}
const resetTime = () => {
	setDisplayTime(25 * 60)
	setBreakTime(5 * 60)
	setSessionTime(25 * 60)
}

	return (
	<div className="text-center">
	<h1>25 + 5 clock</h1>
	<div className="holder">
	<h1 id="break-label">Break Length</h1>
	<Length changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatTime}/>
	<h1 id="session-label">Session Length</h1>
	<Length changeTime={changeTime} type={"session"} time={sessionTime} formatTime={formatTime}/>
	</div>

	<h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>

	<h1 id="time-left">{formatTime(displayTime)}</h1>
	<button id="start_stop" className="btn btn-lg btn-info" onClick={controlTime}>
		{timerOn ? (
			<i class="fa fa-pause-circle"></i>
		) : (
			<i class="fa fa-play-circle"></i>
		)}
	</button>
	<button id="reset" className="btn btn-lg btn-warning" onClick={resetTime}>
		<i className="fa fa-refresh"></i>
	</button>
	</div>
)
}

function Length({ changeTime, type, time, formatTime }) {
	return (
	<div>
		<div>
		<button id={(type == "break") ? "break-decrement" : "session-decrement"} className="btn btn-sm btn-info" onClick={() => changeTime(-60, type)}>
		<i class="fa fa-arrow-down" aria-hidden="true"></i>
		</button>
		<h3 id={(type == "break") ? "break-length" : "session-length"}>{time/60}</h3>
		<button id={(type == "break") ? "break-increment" : "session-increment" } className="btn btn-sm btn-info" onClick={() => changeTime(60, type)}>
		<i class="fa fa-arrow-up" aria-hidden="true"></i>
		</button>
		</div>
	</div>

)
}

ReactDOM.render(<App />, document.getElementById("root"))