import React, { useState, useEffect, useRef } from 'react';
import {
  CssBaseline, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Button, Slider, MenuItem, Select, Snackbar, Alert, IconButton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import './App.css';

const themeLight = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d4a5a5',
    },
    background: {
      default: '#f3e5f5',
    },
  },
  typography: {
    fontFamily: 'Noto Sans, sans-serif',
  },
});

const themeDark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6a1b9a',
    },
    background: {
      default: '#2c003e',  // Darker purple color
    },
  },
  typography: {
    fontFamily: 'Noto Sans, sans-serif',
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [time, setTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(null);
  const [bedTime, setBedTime] = useState(null);
  const [openAlarmDialog, setOpenAlarmDialog] = useState(false);
  const [openBedDialog, setOpenBedDialog] = useState(false);
  const [openSoundDialog, setOpenSoundDialog] = useState(false);
  const [alarmSound, setAlarmSound] = useState('/alarm1.wav');
  const [volume, setVolume] = useState(0.5);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const audioRef = useRef(null);
  const soundPreviewRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    if (alarmTime && time.getHours() === alarmTime.getHours() && time.getMinutes() === alarmTime.getMinutes()) {
      audioRef.current.play();
    }

    if (bedTime && time.getHours() === bedTime.getHours() && time.getMinutes() === bedTime.getMinutes()) {
      audioRef.current.play();
    }

    return () => clearInterval(timer);
  }, [time, alarmTime, bedTime]);

  const handleAlarmSubmit = () => {
    const [hours, minutes] = document.getElementById('alarm-time').value.split(':');
    const newAlarmTime = new Date();
    newAlarmTime.setHours(hours);
    newAlarmTime.setMinutes(minutes);
    setAlarmTime(newAlarmTime);
    setOpenAlarmDialog(false);
    showAlert('Alarm set successfully!', 'success');
  };

  const handleBedSubmit = () => {
    const [hours, minutes] = document.getElementById('bed-time').value.split(':');
    const newBedTime = new Date();
    newBedTime.setHours(hours);
    newBedTime.setMinutes(minutes);
    setBedTime(newBedTime);
    setOpenBedDialog(false);
    showAlert('Bedtime set successfully!', 'success');
  };

  const handleSoundSubmit = () => {
    setOpenSoundDialog(false);
  };

  const handleStopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      showAlert('Alarm stopped!', 'success');
    }
  };

  const handleSnooze = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setTimeout(() => {
        audioRef.current.play();
      }, 600000); // Snooze for 10 minutes
      showAlert('Alarm snoozed for 10 minutes!', 'success');
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (audioRef.current) audioRef.current.volume = newValue;
    if (soundPreviewRef.current) soundPreviewRef.current.volume = newValue;
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSoundPreview = (sound) => {
    if (soundPreviewRef.current) {
      soundPreviewRef.current.src = sound;
      soundPreviewRef.current.play();
    }
  };

  const handleSoundStop = () => {
    if (soundPreviewRef.current) {
      soundPreviewRef.current.pause();
      soundPreviewRef.current.currentTime = 0;
    }
  };

  const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <ThemeProvider theme={darkMode ? themeDark : themeLight}>
      <CssBaseline />
      <div className={`App ${darkMode ? 'dark' : 'light'}`}>
        <div className="date">{time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div className="clock">{formattedTime}</div>
        <audio ref={audioRef} src={alarmSound} />
        <audio ref={soundPreviewRef} />
        <div className="controls">
          <span onClick={() => setDarkMode(!darkMode)} className="emoji" role="img" aria-label="moon">
            {darkMode ? '🌕' : '🌑'}
          </span>
          <span onClick={() => setOpenAlarmDialog(true)} className="emoji" role="img" aria-label="alarm">
            ⏰
          </span>
          <span onClick={() => setOpenBedDialog(true)} className="emoji" role="img" aria-label="bed">
            🛏️
          </span>
          <span onClick={() => setOpenSoundDialog(true)} className="emoji" role="img" aria-label="sound">
            🎵
          </span>
        </div>
        <div className="volume-control">
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            aria-labelledby="continuous-slider"
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <div className="alarm-controls">
          <Button onClick={handleStopAlarm} variant="contained" color="primary">Stop</Button>
          <Button onClick={handleSnooze} variant="contained" color="primary">Snooze</Button>
        </div>

        <Dialog open={openAlarmDialog} onClose={() => {
          setOpenAlarmDialog(false);
          showAlert('Alarm setting cancelled!', 'error');
        }}>
          <DialogTitle>Set Alarm</DialogTitle>
          <DialogContent>
            <TextField id="alarm-time" type="time" fullWidth className={`input ${darkMode ? 'dark-input' : 'light-input'}`} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenAlarmDialog(false);
              showAlert('Alarm setting cancelled!', 'error');
            }}>Cancel</Button>
            <Button onClick={handleAlarmSubmit}>Set</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openBedDialog} onClose={() => {
          setOpenBedDialog(false);
          showAlert('Bedtime setting cancelled!', 'error');
        }}>
          <DialogTitle>Set Bed Time</DialogTitle>
          <DialogContent>
            <TextField id="bed-time" type="time" fullWidth className={`input ${darkMode ? 'dark-input' : 'light-input'}`} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenBedDialog(false);
              showAlert('Bedtime setting cancelled!', 'error');
            }}>Cancel</Button>
            <Button onClick={handleBedSubmit}>Set</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openSoundDialog} onClose={() => setOpenSoundDialog(false)}>
          <DialogTitle>Select Alarm Sound</DialogTitle>
          <DialogContent>
            <div className={`input ${darkMode ? 'dark-input' : 'light-input'}`}>
              <Select
                id="alarm-sound"
                value={alarmSound}
                onChange={(e) => {
                  setAlarmSound(e.target.value);
                }}
                fullWidth
              >
                <MenuItem value="/alarm1.wav">
                  <b>Gaming</b>
                  <IconButton onClick={() => handleSoundPreview('/alarm1.wav')}>
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton onClick={handleSoundStop}>
                    <StopIcon />
                  </IconButton>
                </MenuItem>
                <MenuItem value="/alarm2.wav">
                  <b>Rooster</b>
                  <IconButton onClick={() => handleSoundPreview('/alarm2.wav')}>
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton onClick={handleSoundStop}>
                    <StopIcon />
                  </IconButton>
                </MenuItem>
                <MenuItem value="/alarm3.wav">
                  <b>Sci-Fi</b>
                  <IconButton onClick={() => handleSoundPreview('/alarm3.wav')}>
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton onClick={handleSoundStop}>
                    <StopIcon />
                  </IconButton>
                </MenuItem>
              </Select>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSoundDialog(false)}>Cancel</Button>
            <Button onClick={handleSoundSubmit}>Set</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;
