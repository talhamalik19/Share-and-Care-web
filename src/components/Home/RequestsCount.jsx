import React from 'react';
import { Card, Table, Spinner } from 'react-bootstrap';
import { GLOBALSTYLES as GS } from '../../utils/styles';

export default function RequestsCount({ hospitalRecord, isLoading }) {
  return (
    <Card style={{ width: '60%' }}>
      <Card.Header
        style={{
          textAlign: 'center',
          backgroundColor: GS.primary,
          color: 'white',
        }}
      >
        Stats
      </Card.Header>
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner animation='border' role='status' variant='primary' />
        </div>
      ) : (
        <Table
          style={{
            marginBottom: 0,
          }}
          striped
          hover
        >
          <tbody>
            <tr>
              <td>Resources Requests (Total)</td>
              <td>{hospitalRecord.resources.requestsMadeByHospitalTotal}</td>
            </tr>
            <tr>
              <td>Resources Requests (Pending)</td>
              <td>{hospitalRecord.resources.requestsMadeByHospitalPending}</td>
            </tr>
            <tr>
              <td>Resources Requests (Approved)</td>
              <td>{hospitalRecord.resources.requestsMadeByHospitalApproved}</td>
            </tr>
            <tr>
              <td>Resources Requests (Approved By You)</td>
              <td>{hospitalRecord.resources.requestsApprovedByHospital}</td>
            </tr>
            <tr>
              <td>Volunteers Requests (Total)</td>
              <td>{hospitalRecord.volunteers.requestsMadeByHospitalTotal}</td>
            </tr>
            <tr>
              <td>Total Volunteers </td>
              <td>{hospitalRecord.volunteers.totalVolunteers}</td>
            </tr>
            <tr>
              <td>Approved Volunteers </td>
              <td>{hospitalRecord.volunteers.approvedVolunteers}</td>
            </tr>
            <tr>
              <td>Pending Volunteers </td>
              <td>{hospitalRecord.volunteers.pendingVolunteers}</td>
            </tr>
          </tbody>
        </Table>
      )}
    </Card>
  );
}
