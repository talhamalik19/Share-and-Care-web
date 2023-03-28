import React, { useState } from 'react';
import ButtonView from '../UI/ButtonView';
import { toast } from 'react-toastify';
import axios from 'axios';
import { GLOBALS } from '../../utils/constants';
import Applicants from './Applicants';
import ModalView from '../UI/ModalView';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function RightPane({ activeVolunteer, setRefresh }) {
  const navigate = useNavigate();

  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const handleUpdateRequest = async (requestStatus) => {
    setIsLoading1(true);
    await axios
      .post(`${GLOBALS.BASE_URL}/volunteers/updateRequestStatus`, {
        volunteerRequestId: activeVolunteer._id,
        requestStatus,
      })
      .then((response) => {
        if (response.data.status === '200') {
          toast.success(response.data.message);
        } else {
          toast.warning(response.data.message);
        }
      })
      .catch((error) => {
        toast.warning('Error updating request');
      })
      .finally(() => {
        setIsLoading1(false);
        setRefresh((prev) => !prev);
      });
  };

  const handleDeleteRequest = async () => {
    setIsLoading2(true);
    await axios
      .post(`${GLOBALS.BASE_URL}/volunteers/deleteRequest`, {
        volunteerRequestId: activeVolunteer._id,
      })
      .then((response) => {
        if (response.data.status === '200') {
          toast.success(response.data.message);
        } else {
          toast.warning(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.warning('Error deleting request');
      })
      .finally(() => {
        setIsLoading2(false);
        setRefresh((prev) => !prev);
      });
  };

  if (JSON.stringify(activeVolunteer) === '{}') {
    return null;
  }

  return (
    <>
      <div
        style={{
          width: '70%',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.5rem',
          overflowY: 'scroll',
          minHeight: '78vh',
          maxHeight: '78vh',
        }}
        id='right-pane'
      >
        <Table striped hover>
          <thead>
            <tr>
              <th colSpan={2}>{activeVolunteer.volunteerRequestTitle}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  width: '30%',
                }}
              >
                Request Status
              </td>
              <td>
                <span
                  style={{
                    color:
                      activeVolunteer.requestStatus === 'Enabled'
                        ? 'white'
                        : 'black',
                    backgroundColor:
                      activeVolunteer.requestStatus === 'Enabled'
                        ? 'green'
                        : 'yellow',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.4rem',
                  }}
                >
                  {activeVolunteer.requestStatus}
                </span>
              </td>
            </tr>
            <tr>
              <td>Volunteers Required</td>
              <td>{activeVolunteer.volunteersRequired}</td>
            </tr>
            <tr>
              <td>Applicants</td>
              <td>{activeVolunteer.applicants.length}</td>
            </tr>
            <tr>
              <td>Duration</td>
              <td>{activeVolunteer.timeDuration}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{activeVolunteer.volunteerRequestDescription}</td>
            </tr>
            <tr>
              <td align='center' colSpan={2}>
                {activeVolunteer.applicants.length === 0 && (
                  <ButtonView
                    type='button'
                    variant='primary'
                    onClick={() => {
                      navigate('/volunteer-request', {
                        state: {
                          activeVolunteer: activeVolunteer,
                        },
                      });
                    }}
                    style={{
                      marginRight: '1rem',
                    }}
                  >
                    Update Request
                  </ButtonView>
                )}
                <ButtonView
                  type='button'
                  variant={
                    activeVolunteer.requestStatus === 'Enabled'
                      ? 'warning'
                      : 'success'
                  }
                  isLoading={isLoading1}
                  onClick={
                    activeVolunteer.requestStatus === 'Enabled'
                      ? () => handleUpdateRequest('Disabled')
                      : () => handleUpdateRequest('Enabled')
                  }
                  style={{
                    marginRight: '1rem',
                  }}
                >
                  {activeVolunteer.requestStatus === 'Enabled'
                    ? 'Disable Request'
                    : 'Enable Request'}
                </ButtonView>
                <ButtonView
                  type='button'
                  variant='danger'
                  isLoading={isLoading2}
                  onClick={() => setShowModal(true)}
                >
                  Delete Request
                </ButtonView>
              </td>
            </tr>
          </tbody>
        </Table>
        <h4
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          Applicants
        </h4>
        <Applicants
          applicants={activeVolunteer.applicants}
          setRefresh={setRefresh}
          volunteerRequestId={activeVolunteer._id}
        />
        <ModalView
          showModal={showModal}
          setShowModal={setShowModal}
          modalTitle='Delete Volunteer Request'
          modalBody='Are you sure you want to delete this volunteer request?'
          action2Text='Delete Request'
          action2Color='danger'
          action2Function={handleDeleteRequest}
          isLoading={isLoading2}
        />
      </div>
    </>
  );
}
