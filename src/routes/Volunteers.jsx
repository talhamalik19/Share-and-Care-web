import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { GLOBALS } from '../utils/constants';
import ControlsBar from '../components/Volunteers/ControlsBar';
import LeftPane from '../components/Volunteers/LeftPane';
import RightPane from '../components/Volunteers/RightPane';
import { useSelector } from 'react-redux';

export default function Volunteers() {
  const [isLoading, setIsLoading] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [activeVolunteer, setActiveVolunteer] = useState({});
  const [refresh, setRefresh] = useState(false);

  const hospital = useSelector((state) => state.hospital);
  const { email } = hospital;

  const radios = [
    { name: 'My Requests (Enabled)', value: '1' },
    { name: 'My Requests (All)', value: '2' },
  ];

  const [radioValue, setRadioValue] = useState('2');

  const filterVolunteers = (radioValue, volunteers) => {
    switch (radioValue) {
      case '1':
        return volunteers
          .filter((volunteerReq) => volunteerReq.requestStatus === 'Enabled')
          .reverse();
      case '2':
        return volunteers.reverse();
      default:
        return volunteers.reverse();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await axios.post(
        `${GLOBALS.BASE_URL}/volunteers/fetchMyRequests`,
        {
          hospitalEmail: email,
        }
      );
      setVolunteers(response.data.results);
      setIsLoading(false);
    };
    fetchData();
    setActiveVolunteer({});
  }, [refresh, radioValue, email]);

  useEffect(() => {
    setFilteredVolunteers(filterVolunteers(radioValue, volunteers));
  }, [radioValue, volunteers]);

  const handleSelectVolunteer = (resource) => {
    setActiveVolunteer(resource);
  };

  return (
    <Container
      style={{}}
      className='d-flex align-items-center justify-content-center my-2'
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '85vh',
        }}
      >
        <ControlsBar
          radios={radios}
          radioValue={radioValue}
          setRadioValue={setRadioValue}
        />

        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
          id='content'
        >
          <LeftPane
            volunteers={filteredVolunteers}
            handleSelectVolunteer={handleSelectVolunteer}
            activeVolunteer={activeVolunteer}
            isLoading={isLoading}
          />

          <RightPane
            activeVolunteer={activeVolunteer}
            setRefresh={setRefresh}
          />
        </div>
      </div>
    </Container>
  );
}
