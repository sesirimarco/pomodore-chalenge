import React from 'react';
import './App.css';
import * as ReactBootstrap from 'react-bootstrap';
const Container = ReactBootstrap.Container;
const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Button = ReactBootstrap.Button;
const Alert = ReactBootstrap.Alert;

//const SESSION = 1500;
const TIMER_LABEL_SESSION = 'Session';
const TIMER_LABEL_BREAK = 'Break';
const SESSION_LENGTH = 25;
const SHORT_BREAK = 5;

const showTime = (min) => {
    const minutes = Math.floor(min / 60);
    const seconds = min - minutes * 60;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    return `${displayMinutes}:${displaySeconds}`;
};
const App = () => {
    const audioRef = React.useRef(null);

	const [currentTime, setCurrentTime] = React.useState(SESSION_LENGTH * 60);
    
    const [timeLeft, setTimeLeft] = React.useState(showTime(currentTime));
    const [timerLabel, setTimerlabel] = React.useState(TIMER_LABEL_SESSION);
    
    const [sessionLength, setSessionLength] = React.useState(SESSION_LENGTH);
    const [shortBreak, setShortBreak] = React.useState(SHORT_BREAK);
    const [isSessionStatus, setIsSessionStatus] = React.useState(true);
    
    const [isRunning, setIsRunning] = React.useState(false);
    const [isRunningBreak, setIsRunningBreak] = React.useState(false);
    
    let timerInterval = null;
    React.useEffect(() => {
        
		if (isRunning) {
            timerInterval = setInterval(() => {
				handleTime();
			}, 1000);
		} else {
			clearInterval(timerInterval);
		}
		
        return () => {
            clearInterval(timerInterval);
        };
    }, [isRunning, currentTime]);
    
	const handleTime = () => {
		if ( currentTime > 0) {
			setTimeLeft(showTime(currentTime - 1));
			setCurrentTime(currentTime - 1);
			
		}
		if (currentTime === 0) {
            setTimeLeft('00:00');
            audioRef.current.play();
            clearInterval(timerInterval);
            if(isSessionStatus) {
                setTimerlabel(TIMER_LABEL_BREAK);
                setCurrentTime(shortBreak * 60);
                setIsSessionStatus(false);    
            }else {
                
                setTimerlabel(TIMER_LABEL_SESSION);
                setCurrentTime(SESSION_LENGTH * 60);
                setIsSessionStatus(true);
            }
		}
    };
    const reset = () => {
        setTimeLeft(showTime(SESSION_LENGTH * 60));
        setCurrentTime(SESSION_LENGTH * 60);
        setShortBreak(SHORT_BREAK);
        setIsRunning(false);
        setTimerlabel(TIMER_LABEL_SESSION);
        clearInterval(timerInterval);
        setSessionLength(SESSION_LENGTH);
        setIsSessionStatus(true);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    };
    return (
        <Container style={{ minWidth: 300, maxWidth: 700 }}>
            <h1> Pomofocus </h1>
            <Row>
                <Col>
                    <div id="session-label"> session length</div>
                    <Button 
                        variant="info"
                        id="session-decrement"
                        onClick={() => {
                            if (sessionLength > 1 && sessionLength < 60) {
								console.log(sessionLength - 1)
                                setSessionLength(sessionLength - 1);
								setTimeLeft(showTime((sessionLength - 1) * 60));
								setCurrentTime((sessionLength - 1) * 60);
                            }
                        }}
                    >
                        -
                    </Button>
                    <Alert 
                        variant="info" 
                        id="session-length"
                        className="d-inline"
                    >   
                        <span id="session-length">{sessionLength}</span>
                    </Alert>
                    <Button
                        variant="info"
                        id="session-increment"
                        onClick={() => {
                            if (sessionLength < 60) {
                                setSessionLength(sessionLength + 1);
                                setTimeLeft(showTime((sessionLength + 1) * 60));
                            }
                        }}
                    >
                        +
                    </Button>
                </Col>
                <Col>
                    <div id="break-label">Break</div>
                    <Button
                        variant="info"
                        id="break-decrement"
                        onClick={() => {
                            setShortBreak(shortBreak > 1 ? shortBreak - 1 : 1);
                        }}
                    >
                        -
                    </Button>
                    <Alert 
                        variant="info" 
                        id="session-length"
                        className="d-inline"
                    > 
                        <span id="break-length">{shortBreak}</span>
                    </Alert>
                    <Button
                        variant="info"
                        id="break-increment"
                        onClick={() => {
                            setShortBreak(
                                shortBreak < 60 ? shortBreak + 1 : 60
                            );
                        }}
                    >
                        +
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col className="offset-3">
                    <div id="timer-label" className="pt-2">
                        {timerLabel}
                    </div>
                    <div id="time-left" className="pt-2">
                        {timeLeft}
                    </div>
                    <div className="p-2">
                        <button
                            id="start_stop"
                            onClick={() => {
                                setIsRunning(!isRunning);
                            }}
                        >
                            {!isRunning ? 'Start' : 'Stop'}
                        </button>
                        <button
                            id="reset"
                            onClick={() => {
                                reset();
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </Col>
            </Row>
            <audio 
                id="beep"
                src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" 
                ref={audioRef}
                preload="auto" 
            />
        </Container>
    );
};
export default App;
