import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import dayjs from 'dayjs';

const EditTripModal = ({ open, onClose, tripData, onSave }) => {
    const [tripTitle, setTripTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

  // 초기값 설정
  useEffect(() => {
    if (tripData) {
      setTripTitle(tripData.tripTitle || '');
      setStartDate(tripData.startDate || '');
      setEndDate(tripData.endDate || '');
    }
  }, [tripData]);

  const handleSave = () => {
    onSave({
      tripTitle,
      startDate,
      endDate,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>여행 정보 수정</DialogTitle>
      <DialogContent>
        <TextField
          label="여행 제목"
          value={tripTitle}
          onChange={(e) => setTripTitle(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="시작 날짜"
          type="date"
          value={dayjs(startDate).format('YYYY-MM-DD')}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="종료 날짜"
          type="date"
          value={dayjs(endDate).format('YYYY-MM-DD')}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSave}>저장</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTripModal;
