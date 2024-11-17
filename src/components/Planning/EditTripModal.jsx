import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import dayjs from 'dayjs';

const EditTripModal = ({ open, onClose, tripData, onSave }) => {
    const [tripTitle, setTripTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

  // 초기값 설정
  useEffect(() => {
    console.log('Received tripData:', tripData);  // tripData 로그 확인

    if (tripData) {
      setTripTitle(tripData.tripTitle || '');
      setStartDate(tripData.startDate || '');
      setEndDate(tripData.endDate || '');
    }
  }, [tripData]);

  const handleSave = async () => {
    if(!tripData?.trip_plan_id) {
      console.error("trip_plan_id가 없습니다.")  // trip_plan_id가 없으면 오류 메시지 출력
      return;
    }

    console.log("trip_plan_id: ", tripData.trip_plan_id)  // trip_plan_id 값 확인

    try {
      // 서버에 수정된 여행 정보 보내기 (PUT 요청)
      const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${tripData.trip_plan_id}`, {
        method: 'PUT',  // PUT 메서드로 수정
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_plan_title: tripTitle, // 수정된 여행 제목
          start_date: startDate,      // 수정된 시작 날짜
          end_date: endDate,          // 수정된 종료 날짜
          destination: tripData.destination, // 기존 목적지 그대로
          route_shared: "private",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("여행 정보 수정 성공:", result);
        // 서버 업데이트가 성공하면 Redux에 저장된 tripData도 업데이트
        onSave({
          tripTitle,
          startDate,
          endDate,
        });
      } else {
        console.error("여행 정보 수정 실패:", result.message);
      }
    } catch (error) {
      console.error("여행 정보 수정 중 오류 발생:", error);
    }
    
    onClose();  // 모달 닫기
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
