import React from 'react';
import './App.css';
import * as ReactBootstrap from 'react-bootstrap';
const Container = ReactBootstrap.Container;
const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Button = ReactBootstrap.Button;
const InputGroup = ReactBootstrap.InputGroup;
const FormControl = ReactBootstrap.FormControl;

//const SESSION = 1500;
const TIMER_LABEL_SESSION = 'Session';
const TIMER_LABEL_BREAK = 'Break';
const SESSION_LENGTH = 25;
const SHORT_BREAK = 5;

const showTime = (minutes, seconds) => {
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    return `${displayMinutes}:${displaySeconds}`;
};
const App = () => {
    const audioRef = React.useRef(null);

    //const [currentTime, setCurrentTime] = React.useState(SESSION_LENGTH * 60);
    
    const [timeMinutes, setTimeMinutes] = React.useState(SESSION_LENGTH);
    const [timeSeconds, setTimeSeconds] = React.useState(0);
    const [timeLeft, setTimeLeft] = React.useState(showTime(SESSION_LENGTH, 0));
    const [timerLabel, setTimerlabel] = React.useState(TIMER_LABEL_SESSION);
    const [sessionLength, setSessionLength] = React.useState(SESSION_LENGTH);
    const [shortBreak, setShortBreak] = React.useState(SHORT_BREAK);
    const [isSessionStatus, setIsSessionStatus] = React.useState(true);
    const [isRunning, setIsRunning] = React.useState(false);
    
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
    }, [isRunning, timeSeconds]);
    
    const updateMinutes = () => {
			setTimeMinutes(timeMinutes - 1);
    };
    
	const handleTime = () => {
        setTimeLeft(showTime(timeMinutes, timeSeconds));
		if (timeMinutes === 0 && timeSeconds === 0) {
            //setTimeLeft('00:00');
            //audioRef.current.pause();
            //audioRef.current.currentTime = 0;
            audioRef.current.play();
            if(isSessionStatus) {
                setTimerlabel(TIMER_LABEL_BREAK);
                setTimeMinutes(shortBreak);
                setTimeSeconds(1);
                setIsSessionStatus(false);    
            }else {
                
                setTimerlabel(TIMER_LABEL_SESSION);
                setTimeMinutes(sessionLength);
                setTimeSeconds(1);
                setIsSessionStatus(true);
            }
		} else if ( timeSeconds === 0) {
            updateMinutes();
            setTimeSeconds(59);
        } else {
            setTimeSeconds(timeSeconds - 1);
        }
    };
    const reset = () => {
        setTimeLeft(showTime(SESSION_LENGTH, 0));
        setTimeMinutes(SESSION_LENGTH);
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
        <Container className="border rounded-lg text-center" style={{ minWidth: 300, maxWidth: 700 }}>
            <h1 className="display-4 text-secondary py-4"> Pomofocus </h1>
            <Row className="justify-content-center">
                <Col>
                    <div id="session-label" className="text-secondary pb-1"> Session length</div>
                    
                    <InputGroup className="mx-auto" style={{width:130}} >
                        <Button
                            disabled={isRunning} 
                            variant="info"
                            id="session-decrement"
                            onClick={() => {
                                if (sessionLength > 1 ) {
                                    setSessionLength(sessionLength - 1);
                                    setTimeLeft(showTime((sessionLength - 1), 0));
                                    setTimeMinutes((sessionLength - 1));
                                }
                            }}
                        >
                            -
                        </Button>
                        <FormControl 
                            disabled={isRunning}
                            id="session-length"
                            value={sessionLength}
                            onChange={(e) => {
                                let currentMinutes = 
                                e.target.value 
                                ? parseInt(e.target.value)
                                : 1;
                                setSessionLength(currentMinutes);
                                setTimeLeft(showTime(currentMinutes, timeSeconds));
                                setTimeMinutes((currentMinutes));
                            }}
                            style={{maxWidth:45}}
                            className="mx-2 text-secondary"
                        >   
                        </FormControl>
                        <Button
                            disabled={isRunning}
                            variant="info"
                            id="session-increment"
                            onClick={() => {
                                if (sessionLength < 60) {
                                    setSessionLength(sessionLength + 1);
                                    setTimeLeft(showTime((sessionLength + 1) , 0));
                                }
                            }}
                        >
                            +
                        </Button>
                    </InputGroup>
                    
                </Col>
                <Col>
                    <div 
                        id="break-label" 
                        className="text-secondary pb-1"
                    >Break</div>
                    <InputGroup className="mx-auto" style={{width:130}}>
                        <Button
                            disabled={isRunning} 
                            variant="info"
                            id="break-decrement"
                            onClick={() => {
                                setShortBreak(shortBreak > 1 ? shortBreak - 1 : 1);
                            }}
                        >-</Button>
                        <FormControl
                            disabled={isRunning} 
                            id="break-length" 
                            value={shortBreak}
                            onChange={(e) => {
                                let currentMinutesBreak = 
                                e.target.value 
                                ? parseInt(e.target.value)
                                : 1;
                                setShortBreak(currentMinutesBreak);
                            }}
                            style={{maxWidth:45}}
                            className="mx-2 text-secondary"
                        />
                        <Button
                            disabled={isRunning} 
                            variant="info"
                            id="break-increment"
                            onClick={() => {
                                setShortBreak(
                                    shortBreak < 60 ? shortBreak + 1 : 60
                                );
                            }}
                        >+</Button>                        
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col className="pt-2">
                    <div 
                        className="border 
                            rounded-pill 
                            my-4 
                            w-50 
                            mx-auto 
                            py-2 
                            shadow-sm"
                        >
                        <div id="timer-label" className="pt-3">
                            <h4 className="text-secondary">{timerLabel}</h4>
                        </div>
                        <div id="time-left" className="timer-font text-info">
                            {timeLeft}
                        </div>
                    </div>
                    <div className="pb-5 pt-3">
                        <Button
                            variant="info"
                            className="mx-4"
                            id="start_stop"
                            onClick={() => {
                                setIsRunning(!isRunning);
                            }}
                        >
                            {!isRunning ? 'Start' : 'Stop'}
                        </Button>
                        <Button
                            variant="info"
                            className="mx-4"
                            id="reset"
                            onClick={() => {
                                reset();
                            }}
                        >
                            Reset
                        </Button>
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
