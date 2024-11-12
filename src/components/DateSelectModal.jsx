import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogActions, Button, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch } from "react-redux";
import { addTripData } from '../store/placeSlice'; // Redux 액션
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSelector } from 'react-redux';

const DateSelectModal = ({ open, onClose, onConfirm, selectedPlaces, defaultTripData }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [tripTitle, setTripTitle] = useState(defaultTripData?.tripTitle || ''); // 기본 제목 설정
  const [destination, setDestination] = useState(defaultTripData?.destination || ''); // 기본 목적지 설정

  const dispatch = useDispatch();

  // userSlice에서 user_id 가져오기
  const userId = useSelector((state) => state.user.userInfo.userId);    

  // defaultTripData가 변경될 때 초기값 설정
  useEffect(() => {
    if (defaultTripData) {
      setTripTitle(defaultTripData.tripTitle || '')
      setDestination(defaultTripData.destination || '')
    }
  }, [defaultTripData])

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

  const handleConfirm = async () => {
    // 날짜 형식 변환
    const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : null;
    const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : null;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
  
    const tripData = {
      tripTitle,
      destination: destination,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      created_at: createdAt,
    };
  
    try {
      // tripData를 데이터베이스에 저장하고 trip_plan_id를 받아옴
      const response = await fetch('http://15.164.142.129:3001/api/trip_plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId || 1, // 실제 user_id 값으로 교체
          trip_plan_title: tripData.tripTitle,
          start_date: tripData.startDate,
          end_date: tripData.endDate,
          destination: tripData.destination,
          route_shared: "private",
        }),
      });
  
      const result = await response.json();
      console.log("Server Response:", result); // 서버 응답 확인

      if (response.ok && result.success) {
        const tripPlanId = result.data.trip_plan_id;
        const tripDataWithId = { ...tripData, trip_plan_id: tripPlanId, route_shared: result.data.route_shared};
  
        console.log("Trip Data with ID:", tripDataWithId); // tripDataWithId 확인
      
        // Redux에 저장
        dispatch(addTripData({ tripData: tripDataWithId, places: selectedPlaces }));
  
      // BestCardDetailRecommend.jsx의 handleDateSelectConfirm으로 tripDataWithId 전달
      onConfirm(tripDataWithId);
      } else {
        console.error("여행 데이터 저장 실패:", result.message);
      }
    } catch (error) {
      console.error("장소 추가 중 오류 발생:", error);
    }
  
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
      <DialogTitle>여행 날짜를 선택하세요</DialogTitle>
      <InfoText>여행 기간은 최대 10일까지 선택할 수 있습니다.</InfoText>
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

const InfoText = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 8px;
  margin-bottom: 20px;
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
