import React, { useState } from 'react';
import ButtonView from '../UI/ButtonView';
import { toast } from 'react-toastify';
import axios from 'axios';
import { GLOBALS } from '../../utils/constants';
import ModalView from '../UI/ModalView';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function RightPane({ activeResource, hospital, setRefresh }) {
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  const [action2Text, setAction2Text] = useState('');
  const [action2Function, setAction2Function] = useState(null);
  const [action2Color, setAction2Color] = useState('');
  const [action2Loading, setAction2Loading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const navigate = useNavigate();

  const handleApproveRequest = async () => {
    if (activeResource.requestedByEmail === hospital.email) {
      toast.error('You cannot approve your own request');
    } else {
      setIsLoading1(true);
      setAction2Loading(true);
      const record = {
        id: activeResource._id,
        requestStatus: 'Approved',
        approvedByName: hospital.name,
        approvedByEmail: hospital.email,
        approvedByPhone: hospital.phone,
      };
      await axios
        .put(`${GLOBALS.BASE_URL}/resources/approveRequest`, record)
        .then((response) => {
          if (response.data.status === '200') {
            toast.success(response.data.message);
          } else {
            toast.warning(response.data.message);
          }
        })
        .catch((error) => {
          toast.warning('Error approving request');
        })
        .finally(() => {
          setIsLoading1(false);
          setAction2Loading(false);
          setRefresh((prev) => !prev);
        });
    }
  };

  const handleHideRequest = async () => {
    if (activeResource.requestedByEmail === hospital.email) {
      toast.error('You cannot hide your own request');
    } else {
      setIsLoading2(true);
      setAction2Loading(true);
      const record = {
        id: activeResource._id,
        email: hospital.email,
      };
      await axios
        .put(`${GLOBALS.BASE_URL}/resources/hideRequest`, record)
        .then((response) => {
          if (response.data.status === '200') {
            toast.success(response.data.message);
          } else {
            toast.warning(response.data.message);
          }
        })
        .catch((error) => {
          toast.warning('Error hiding request');
        })
        .finally(() => {
          setIsLoading2(false);
          setAction2Loading(false);
          setRefresh((prev) => !prev);
        });
    }
  };

  const handleDeleteRequest = async () => {
    if (activeResource.requestedByEmail !== hospital.email) {
      toast.error("You cannot delete someone else's request");
    } else {
      setIsLoading3(true);
      setAction2Loading(true);
      const record = {
        id: activeResource._id,
        email: hospital.email,
      };
      await axios
        .post(`${GLOBALS.BASE_URL}/resources/deleteRequest`, record)
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
          setIsLoading3(false);
          setAction2Loading(false);
          setRefresh((prev) => !prev);
        });
    }
  };

  if (JSON.stringify(activeResource) === '{}') {
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
              <th rowSpan={2}>{activeResource.resourceName}</th>
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
                      activeResource.requestStatus === 'Pending'
                        ? 'black'
                        : 'white',
                    backgroundColor:
                      activeResource.requestStatus === 'Pending'
                        ? 'yellow'
                        : 'green',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.4rem',
                  }}
                >
                  {activeResource.requestStatus}
                </span>
              </td>
            </tr>
            <tr>
              <td>Quantity</td>
              <td>{activeResource.resourceQuantity}</td>
            </tr>
            <tr>
              <td>Duration</td>
              <td>{activeResource.resourceDuration}</td>
            </tr>
            <tr>
              <td>Additional Notes</td>
              <td>
                {activeResource.resourceNotes.trim() === ''
                  ? 'None'
                  : activeResource.resourceNotes}
              </td>
            </tr>
            {activeResource.requestedByEmail !== hospital.email && (
              <>
                <tr>
                  <th colSpan={2}>Requested By</th>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{activeResource.requestedByName}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{activeResource.requestedByEmail}</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>{activeResource.requestedByPhone}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{activeResource.requestedByAddress}</td>
                </tr>
              </>
            )}

            {activeResource.requestStatus === 'Approved' &&
              activeResource.approvedByEmail !== hospital.email && (
                <>
                  <tr>
                    <th colSpan={2}>Approved By</th>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>{activeResource.approvedByName}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{activeResource.approvedByEmail}</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td>{activeResource.approvedByPhone}</td>
                  </tr>
                </>
              )}

            {activeResource.requestStatus === 'Pending' &&
              activeResource.requestedByEmail !== hospital.email && (
                <>
                  <tr>
                    <td colSpan={2}>
                      <ButtonView
                        type='button'
                        variant='primary'
                        isLoading={isLoading1}
                        onClick={() => {
                          setModalTitle('Approve Request');
                          setModalBody(
                            'I assure the resources are available and are of good quality!'
                          );
                          setAction2Color('success');
                          setAction2Text('Approve Request');
                          setAction2Function(() => handleApproveRequest);
                          setShowModal(true);
                        }}
                      >
                        Approve Request
                      </ButtonView>
                      <ButtonView
                        type='button'
                        variant='secondary'
                        isLoading={isLoading2}
                        onClick={() => {
                          setModalTitle('Hide Request');
                          setModalBody(
                            'Are you sure you want to hide this request?'
                          );
                          setAction2Color('success');
                          setAction2Text('Hide Request');
                          setAction2Function(() => handleHideRequest);
                          setShowModal(true);
                        }}
                        style={{ marginLeft: '1rem' }}
                      >
                        Hide Request
                      </ButtonView>
                    </td>
                  </tr>
                </>
              )}
            {activeResource.requestStatus === 'Pending' &&
              activeResource.requestedByEmail === hospital.email && (
                <tr>
                  <td colSpan={2} align='center'>
                    <ButtonView
                      type='button'
                      variant='primary'
                      onClick={() => {
                        navigate('/resource-request/', {
                          state: { activeResource: activeResource },
                        });
                      }}
                    >
                      Update Request
                    </ButtonView>
                    <ButtonView
                      type='button'
                      variant='danger'
                      isLoading={isLoading3}
                      style={{ marginLeft: '1rem' }}
                      onClick={() => {
                        setModalTitle('Delete Request');
                        setModalBody(
                          'Are you sure you want to delete this request?'
                        );
                        setAction2Color('danger');
                        setAction2Text('Delete Request');
                        setAction2Function(() => handleDeleteRequest);
                        setShowModal(true);
                      }}
                    >
                      Delete Request
                    </ButtonView>
                  </td>
                </tr>
              )}
          </tbody>
        </Table>
      </div>
      <ModalView
        showModal={showModal}
        setShowModal={setShowModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
        action2Text={action2Text}
        action2Loading={action2Loading}
        action2Color={action2Color}
        action2Function={action2Function}
        isLoading={action2Loading}
      />
    </>
  );
}
