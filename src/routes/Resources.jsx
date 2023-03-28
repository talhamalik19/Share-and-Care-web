import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { GLOBALS } from '../utils/constants';
import ControlsBar from '../components/Resources/ControlsBar';
import LeftPane from '../components/Resources/LeftPane';
import RightPane from '../components/Resources/RightPane';
import { useSelector } from 'react-redux';

export default function Resources() {
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeResource, setActiveResource] = useState({});
  const [refresh, setRefresh] = useState(false);

  const hospital = useSelector((state) => state.hospital);
  const { email } = hospital;

  const radios = [
    { name: 'Feed (Users)', value: '1' },
    { name: 'Feed (Hospitals)', value: '2' },
    { name: 'Approved By You', value: '3' },
    { name: 'My Requests', value: '4' },
  ];

  const [radioValue, setRadioValue] = useState('2');

  const filterResources = (radioValue, resources) => {
    switch (radioValue) {
      case '1':
        return resources
          .filter(
            (resource) =>
              resource.requestStatus === 'Pending' &&
              resource.requestedByEmail !== email &&
              resource.userType === 'user' &&
              resource.ignoredBy.includes(email) === false
          )
          .reverse();
      case '2':
        return resources
          .filter(
            (resource) =>
              resource.requestStatus === 'Pending' &&
              resource.requestedByEmail !== email &&
              resource.userType === 'hospital' &&
              resource.ignoredBy.includes(email) === false
          )
          .reverse();
      case '3':
        return resources
          .filter(
            (resource) =>
              resource.requestStatus === 'Approved' &&
              resource.approvedByEmail === email
          )
          .reverse();
      case '4':
        return resources
          .filter((resource) => resource.requestedByEmail === email)
          .reverse();
      default:
        return resources.reverse();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await axios.post(
        `${GLOBALS.BASE_URL}/resources/fetchRequests`,
        {
          userType: 'hospital',
        }
      );
      setResources(response.data.results);
      setIsLoading(false);
    };
    fetchData();
    setActiveResource({});
  }, [refresh, radioValue]);

  useEffect(() => {
    setFilteredResources(filterResources(radioValue, resources));
  }, [radioValue, resources]);

  const handleSelectResource = (resource) => {
    setActiveResource(resource);
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
            minHeight: '78vh',
            maxHeight: '78vh',
          }}
          id='content'
        >
          <LeftPane
            resources={filteredResources}
            handleSelectResource={handleSelectResource}
            activeResource={activeResource}
            radioValue={radioValue}
            isLoading={isLoading}
          />

          <RightPane
            hospital={hospital}
            activeResource={activeResource}
            setRefresh={setRefresh}
          />
        </div>
      </div>
    </Container>
  );
}
