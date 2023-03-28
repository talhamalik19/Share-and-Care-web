import React from 'react';
import { Table } from 'react-bootstrap';
import { GLOBALS } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import ButtonView from '../UI/ButtonView';
import { useSelector } from 'react-redux';

export default function Applicants({
  volunteerRequestId,
  applicants,
  setRefresh,
}) {
  const hospital = useSelector((state) => state.hospital);

  const handleUpdateApplicantStatus = async (applicant, status) => {
    await axios
      .post(`${GLOBALS.BASE_URL}/volunteers/updateApplicantStatus`, {
        volunteerRequestId,
        applicantId: applicant._id,
        applicantEmail: applicant.applicantEmail,
        hospitalName: hospital.name,
        requestStatus: status,
      })
      .then((response) => {
        if (response.data.status === '200') {
          toast.success(response.data.message);
        } else {
          toast.warning(response.data.message);
        }
      })
      .catch((error) => {
        toast.warning('Error updating applicant status');
      })
      .finally(() => {
        setRefresh((prev) => !prev);
      });
  };

  return (
    <Table striped bordered hover size='sm'>
      <thead>
        <tr>
          <th style={STYLES.text}>#</th>
          <th style={STYLES.text}>Name</th>
          <th style={STYLES.text}>Email</th>
          <th style={STYLES.text}>Phone</th>
          <th style={STYLES.text}>CNIC</th>
          <th style={STYLES.text}>Status</th>
          <th style={STYLES.text}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {applicants.map((applicant, index) => (
          <tr key={applicant._id}>
            <td style={STYLES.text}>{index + 1}</td>
            <td style={STYLES.text}>{applicant.applicantName}</td>
            <td style={STYLES.text}>{applicant.applicantEmail}</td>
            <td style={STYLES.text}>{applicant.applicantPhone}</td>
            <td style={STYLES.text}>{applicant.applicantCnic}</td>
            <td
              style={{
                ...STYLES.text,
                color: BACKGROUND[applicant.applicantRequestStatus],
              }}
            >
              {applicant.applicantRequestStatus}
            </td>
            <td>
              <div className='d-flex justify-content-around'>
                {applicant.applicantRequestStatus !== 'Approved' && (
                  <ButtonView
                    onClick={() =>
                      handleUpdateApplicantStatus(applicant, 'Approved')
                    }
                    variant='success'
                    title='Approve'
                    type='button'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      class='bi bi-check-lg'
                      viewBox='0 0 16 16'
                    >
                      <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z' />
                    </svg>
                  </ButtonView>
                )}
                {applicant.applicantRequestStatus !== 'Rejected' && (
                  <ButtonView
                    onClick={() =>
                      handleUpdateApplicantStatus(applicant, 'Rejected')
                    }
                    variant='danger'
                    title='Reject'
                    type='button'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      class='bi bi-x-lg'
                      viewBox='0 0 16 16'
                    >
                      <path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z' />
                    </svg>
                  </ButtonView>
                )}
              </div>
            </td>
          </tr>
        ))}

        {applicants.length === 0 && (
          <tr>
            <td colSpan='7' style={{ ...STYLES.text, textAlign: 'center' }}>
              No Applicants
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

const STYLES = {
  text: {
    fontSize: '0.9rem',
    verticalAlign: 'middle',
  },
};

const BACKGROUND = {
  Approved: 'green',
  Applied: 'black',
  Rejected: 'red',
};
