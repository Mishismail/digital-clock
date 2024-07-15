import React, { useState, useEffect } from 'react';
import { Box, Grid, IconButton, Snackbar, Alert } from '@mui/material';
import { NightsStay, WbSunny, Alarm, Hotel } from '@mui/icons-material';
import FlipCard from './FlipCard';
import AlarmSettings from './AlarmSettings';
import '../styles.css';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState({
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: time.getSeconds(),
  });
  const [darkMode, setDarkMode] = useState(false);
  const [alarmTime, setAlarmTime] = useState(null);
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const [alarmMessage, setAlarmMessage] = useState('');

  useEffect(() => {
    const timerId = setInterval(() => {
      const newTime = new Date();
      setTime(newTime);
      setPrevTime({
        hours: newTime.getHours(),
        minutes: newTime.getMinutes(),
        seconds: newTime.getSeconds(),
      });

      if (alarmTime && newTime.getHours() === alarmTime.hours && newTime.getMinutes() === alarmTime.minutes) {
        setAlarmMessage('Wake up! ⏰');
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [alarmTime]);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openAlarmDialog = () => {
    setShowAlarmDialog(true);
  };

  const setAlarm = (hours, minutes) => {
    setAlarmTime({ hours, minutes });
    setShowAlarmDialog(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: darkMode ? 'background.default' : '#fff',
        color: darkMode ? 'text.primary' : '#000',
        flexDirection: 'column',
      }}
    >
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <FlipCard newTime={hours} prevTime={prevTime.hours} />
        </Grid>
        <Grid item>
          <FlipCard newTime={minutes} prevTime={prevTime.minutes} />
        </Grid>
        <Grid item>
          <FlipCard newTime={seconds} prevTime={prevTime.seconds} />
        </Grid>
      </Grid>
      <Box mt={4} display="flex" justifyContent="center">
        <IconButton onClick={toggleDarkMode}>
          {darkMode ? <WbSunny fontSize="large" /> : <NightsStay fontSize="large" />}
        </IconButton>
        <IconButton onClick={openAlarmDialog}>
          <Alarm fontSize="large" />
        </IconButton>
        <IconButton onClick={() => alert('Set Bedtime feature coming soon!')}>
          <Hotel fontSize="large" />
        </IconButton>
      </Box>
      <AlarmSettings open={showAlarmDialog} onClose={() => setShowAlarmDialog(false)} onSetAlarm={setAlarm} />
      <Snackbar open={Boolean(alarmMessage)} autoHideDuration={6000} onClose={() => setAlarmMessage('')}>
        <Alert onClose={() => setAlarmMessage('')} severity="warning">
          {alarmMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DigitalClock;