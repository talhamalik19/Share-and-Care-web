import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GLOBALSTYLES as GS } from '../../utils/styles';

export default function AccountInfo({ name, email, phone, address, website }) {
  return (
    <Card style={{ width: '35%', height: 'fit-content' }}>
      <Card.Header
        style={{
          textAlign: 'center',
          backgroundColor: GS.primary,
          color: 'white',
        }}
      >
        {name}
      </Card.Header>
      <Table
        style={{
          marginBottom: 0,
        }}
        striped
        hover
      >
        <tbody>
          <tr>
            <td>Email</td>
            <td>{email}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{phone}</td>
          </tr>
          <tr>
            <td>Website</td>
            <td>{website || 'Not Provided'}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>{address}</td>
          </tr>
        </tbody>
      </Table>
      <Card.Footer
        style={{
          justifyContent: 'center',
          display: 'flex',
          backgroundColor: GS.primary,
        }}
      >
        <Link
          style={{
            color: 'white',
            fontSize: '0.9rem',
          }}
          to='/update-account'
        >
          Update Account
        </Link>
      </Card.Footer>
    </Card>
  );
}
