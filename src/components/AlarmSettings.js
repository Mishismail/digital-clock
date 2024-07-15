import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const AlarmSettings = ({ open, onClose, onSetAlarm }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleSetAlarm = () => {
    onSetAlarm(parseInt(hours, 10), parseInt(minutes, 10));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set Alarm</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Hour"
          type="number"
          fullWidth
          variant="standard"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Minutes"
          type="number"
          fullWidth
          variant="standard"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSetAlarm}>Set Alarm</Button>
      </DialogActions>
    </Dialog>
  );
};

AlarmSettings.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSetAlarm: PropTypes.func.isRequired,
};

export default AlarmSettings;