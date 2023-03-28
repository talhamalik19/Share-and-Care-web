import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import AccountInfo from '../components/Home/AccountInfo';
import RequestsCount from '../components/Home/RequestsCount';
import axios from 'axios';
import { GLOBALS } from '../utils/constants';
import { toast } from 'react-toastify';

export default function Home() {
  const [hospitalRecord, setHospitalRecord] = useState({});
  const [loading, setLoading] = useState(true);

  const { name, email, phone, address, website } = useSelector(
    (state) => state.hospital
  );

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await axios
        .post(`${GLOBALS.BASE_URL}/hospitals/fetchStats`, { email })
        .then((res) => {
          setHospitalRecord(res.data.hospitalRecord);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getData();
  }, [email]);

  return (
    <Container className='p-3 my-3'>
      <h3 className='header'>Welcome, {name}</h3>
      <div
        className='my-3'
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <RequestsCount hospitalRecord={hospitalRecord} isLoading={loading} />
        <AccountInfo
          name={name}
          email={email}
          phone={phone}
          website={website}
          address={address}
        />
      </div>
    </Container>
  );
}
