import React, { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogActions, Button, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch } from "react-redux";
import { addTripData } from '../store/placeSlice'; // Redux 액션
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DateSelectModal = ({ open, onClose, onConfirm, selectedPlaces }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [tripTitle, setTripTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const dispatch = useDispatch();

  const handleDateChange = (date) => {
    const maxEndDate = dayjs(startDate).add(10, 'day');

    if (!startDate) {
      setStartDate(date);
      setSelectedDates([date]);
    } else if (!endDate) {
      if (dayjs(date).isBefore(startDate)) {
        setStartDate(date);
        setEndDate(null);
        setSelectedDates([date]);
      } else if (dayjs(date).isAfter(maxEndDate)) {
        alert('여행 기간은 최대 10일까지 선택할 수 있습니다.');
      } else {
        setEndDate(date);
        const datesInRange = getDatesInRange(startDate, date);
        setSelectedDates(datesInRange);
      }
    } else {
      setStartDate(date);
      setEndDate(null);
      setSelectedDates([date]);
    }
  };

  const getDatesInRange = (start, end) => {
    const dates = [];
    let currentDate = dayjs(start);
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
      dates.push(currentDate.toDate());
      currentDate = currentDate.add(1, 'day');
    }
    return dates;
  };

  const handleConfirm = () => {
    // 날짜 형식을 "yyyy-mm-dd"로 변환하여 저장
    const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : null;
    const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : null;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const tripData = {
      tripTitle,
      destination,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      created_at: createdAt,
      places: selectedPlaces,
    };
    
    dispatch(addTripData(tripData)); // Redux에 데이터 저장
    onConfirm(tripData); // 부모 컴포넌트로 데이터 전달
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>여행 정보를 입력하고 날짜를 선택하세요</DialogTitle>
      <InputContainer>
        <StyledTextField
          label="여행 제목"
          variant="outlined"
          fullWidth
          value={tripTitle}
          onChange={(e) => setTripTitle(e.target.value)}
        />
        <StyledTextField
          label="목적지"
          variant="outlined"
          fullWidth
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </InputContainer>
      <CalendarContainer>
        <IconButton onClick={handlePrevMonth}>이전</IconButton>
        <Calendars>
          <StyledCalendar
            value={selectedDates}
            onClickDay={handleDateChange}
            activeStartDate={currentMonth.toDate()}
            tileClassName={({ date }) =>
              selectedDates.some((selectedDate) => dayjs(selectedDate).isSame(date, 'day'))
                ? 'selected'
                : ''
            }
            formatDay={(locale, date) => dayjs(date).format('D')}
            selectRange={false}
          />
          <StyledCalendar
            value={selectedDates}
            onClickDay={handleDateChange}
            activeStartDate={currentMonth.add(1, 'month').toDate()}
            tileClassName={({ date }) =>
              selectedDates.some((selectedDate) => dayjs(selectedDate).isSame(date, 'day'))
                ? 'selected'
                : ''
            }
            formatDay={(locale, date) => dayjs(date).format('D')}
            selectRange={false}
          />
        </Calendars>
        <IconButton onClick={handleNextMonth}>다음</IconButton>
      </CalendarContainer>
      <StyledDialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleConfirm} disabled={!startDate || !endDate}>선택</Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 16px;
    padding: 20px;
  }
`;

const DialogTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin: 0;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Calendars = styled.div`
  display: flex;
  gap: 16px;

  /* 작은 화면에서는 한 달만 표시 */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledCalendar = styled(Calendar)`
  border: none;
  font-family: 'Roboto', sans-serif;

  .react-calendar__tile--selected,
  .selected {
    background: #1976d2;
    color: white;
    border-radius: 8px;
  }

  .react-calendar__tile--now {
    background: #e3f2fd;
    color: #1976d2;
  }

  .react-calendar__tile {
    border-radius: 4px;
  }

  .react-calendar__tile--active {
    background: #1565c0;
    color: white;
  }

  .react-calendar__month-view__weekdays__weekday {
    color: gray;
    font-weight: bold;
    text-align: center;
  }
`;

const StyledDialogActions = styled(DialogActions)`
  justify-content: space-between;
  padding: 16px 24px;
`;

const IconButton = styled(Button)`
  font-weight: bold;
`;

export default DateSelectModal;
