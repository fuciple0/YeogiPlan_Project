import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const TripPlan = styled.div`
  margin-bottom: 30px;
`;

const TripPlanTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
`;

const TripDayContainer = styled.div`
  margin-bottom: 20px;
`;

const TripDayTitle = styled.h3`
  font-size: 1.4rem;
  color: #555;
  margin-bottom: 10px;
`;

const PlaceCard = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const PlaceName = styled.p`
  font-weight: bold;
  color: #333;
`;

const PlaceAddress = styled.p`
  color: #555;
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #777;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 1.2rem;
`;

const SharedTripStamps = () => {
  const [tripPlans, setTripPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTripPlans = async () => {
    try {
      const response = await fetch(`http://15.164.142.129:3001/api/user/1/shared_trip_plans`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching trip plans');
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setTripPlans(data.data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTripPlans();
  }, []);

  if (isLoading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{`Error: ${error}`}</ErrorMessage>;
  }

  if (!Array.isArray(tripPlans)) {
    return <ErrorMessage>Unexpected data format</ErrorMessage>;
  }

  return (
    <Container>
      {tripPlans.map((tripPlan) => (
        <TripPlan key={tripPlan.trip_plan_id}>
          <TripPlanTitle>{tripPlan.trip_plan_title}</TripPlanTitle>
          {tripPlan.details.map((detail, index) => (
            <TripDayContainer key={index}>
              <TripDayTitle>Day {detail.trip_day}</TripDayTitle>
              <PlaceCard>
                <PlaceName>{detail.place_name}</PlaceName>
                <PlaceAddress>{detail.memo}</PlaceAddress>
              </PlaceCard>
            </TripDayContainer>
          ))}
        </TripPlan>
      ))}
    </Container>
  );
};

export default SharedTripStamps;