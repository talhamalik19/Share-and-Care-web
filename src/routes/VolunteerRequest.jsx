import React, { useState } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { GLOBALS } from '../utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';
import ModalView from '../components/UI/ModalView';
import LabeledInput from '../components/UI/LabeledInput';
import { toast } from 'react-toastify';
import ButtonView from '../components/UI/ButtonView';
import { useSelector } from 'react-redux';

export default function VolunteerRequest() {
  const navigate = useNavigate();
  const location = useLocation();

  const { activeVolunteer } = location.state ?? {};

  const { email, name, phone, address } = useSelector(
    (state) => state.hospital
  );

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [record, setRecord] = useState({
    hospitalName: name,
    hospitalEmail: email,
    hospitalPhone: phone,
    hospitalLocation: address,
    id: activeVolunteer?._id ?? '',
    volunteerRequestTitle: activeVolunteer?.volunteerRequestTitle ?? '',
    timeDuration: activeVolunteer?.timeDuration ?? '',
    volunteersRequired: activeVolunteer?.volunteersRequired ?? '',
    volunteerRequestDescription:
      activeVolunteer?.volunteerRequestDescription ?? '',
  });

  const [originalRecord] = useState(activeVolunteer ?? {});

  const checkInputs = () => {
    if (record.volunteerRequestTitle.trim().length < 5) {
      setModalTitle('Invalid Title');
      setModalBody('Please enter a valid title');
      return false;
    }

    if (record.timeDuration.trim().length < 5) {
      setModalTitle('Invalid Time Duration');
      setModalBody('Please enter a valid time duration');
      return false;
    }

    if (record.volunteersRequired.trim().length < 1) {
      setModalTitle('Invalid Volunteers Required');
      setModalBody('Please enter the number of volunteers required');
      return false;
    }

    if (record.volunteerRequestDescription.trim().length < 10) {
      setModalTitle('Invalid Description');
      setModalBody('Please enter a valid description');
      return false;
    }
    return true;
  };

  const checkIfChanged = () => {
    if (
      record.volunteerRequestTitle === originalRecord.volunteerRequestTitle &&
      record.timeDuration === originalRecord.timeDuration &&
      record.volunteersRequired === originalRecord.volunteersRequired &&
      record.volunteerRequestDescription ===
        originalRecord.volunteerRequestDescription
    ) {
      setModalTitle('No Changes');
      setModalBody('No changes were made to the volunteer request');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkInputs()) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${GLOBALS.BASE_URL}/volunteers/postRequest`,
          record
        );
        setIsLoading(false);
        if (response.data.status === '200') {
          toast.success('Request Posted Successfully');
          navigate('/volunteers');
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        toast.warning(err.message);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (checkInputs() && checkIfChanged()) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${GLOBALS.BASE_URL}/volunteers/updateRequest`,
          record
        );
        setIsLoading(false);
        if (response.data.status === '200') {
          toast.success(response.data.message);
          navigate('/volunteers');
        } else {
          if (response.data.status === '409') {
            navigate('/volunteers');
          }
          toast.warning(response.data.message);
        }
      } catch (err) {
        console.log(err);
        toast.warning(err.message);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <Container className='d-flex align-items-center justify-content-center my-3'>
        <div className='w-100' style={{ maxWidth: '400px' }}>
          <h3 className='text-center mb-3'>
            {record.id !== '' ? 'Update' : 'New'} Volunteers Request
          </h3>
          <Form onSubmit={record.id !== '' ? handleUpdate : handleSubmit}>
            <LabeledInput
              label='Title *'
              controlId={'volunteerRequestTitle'}
              type='text'
              name='volunteerRequestTitle'
              value={record.volunteerRequestTitle}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={15}
              placeholder='Need Volunteers Immediately'
            />
            <Row>
              <LabeledInput
                label='Volunteers Required *'
                controlId={'volunteersRequired'}
                type='text'
                name='volunteersRequired'
                value={record.volunteersRequired}
                onChange={handleChange}
                required
                placeholder='10'
                minLength={1}
                maxLength={2}
                containerAs={Col}
              />
              <LabeledInput
                label='Duration *'
                controlId='timeDuration'
                type='text'
                name='timeDuration'
                value={record.timeDuration}
                onChange={(e) => handleChange(e)}
                placeholder='15 days'
                required
                minLength={5}
                maxLength={8}
                containerAs={Col}
              />
            </Row>

            <LabeledInput
              controlId='volunteerRequestDescription'
              label='Description *'
              type='text-area'
              as='textarea'
              style={{ height: '100px' }}
              name='volunteerRequestDescription'
              value={record.volunteerRequestDescription}
              onChange={(e) => handleChange(e)}
              placeholder=''
              required
              minLength={10}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ButtonView variant='primary' isLoading={isLoading} type='submit'>
                {record.id !== '' ? 'Update' : 'Post'} Request
              </ButtonView>
            </div>
          </Form>
        </div>
      </Container>
      <ModalView
        showModal={showModal}
        setShowModal={setShowModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
    </>
  );
}
