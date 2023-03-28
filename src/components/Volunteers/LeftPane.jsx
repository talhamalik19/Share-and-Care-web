import React from 'react';
import { GLOBALSTYLES as GS } from '../../utils/styles';
import { Badge, Spinner } from 'react-bootstrap';

export default function LeftPane({
  volunteers,
  handleSelectVolunteer,
  activeVolunteer,
  isLoading,
}) {
  return (
    <div
      style={{
        width: '30%',
        overflowY: 'scroll',
        minHeight: '78vh',
        maxHeight: '78vh',
      }}
      id='left-pane'
    >
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem',
          }}
        >
          <Spinner animation='border' role='status' variant='primary' />
        </div>
      ) : (
        <>
          {volunteers.map((volunteer) => {
            return (
              <div
                key={volunteer._id}
                style={{
                  backgroundColor:
                    activeVolunteer._id === volunteer._id
                      ? GS.secondary
                      : GS.primary,
                  borderRadius: '0.2rem',
                  padding: '0.5rem',
                  margin: '0.5rem 0.3rem',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectVolunteer(volunteer)}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <p style={STYLES.text}>{volunteer.volunteerRequestTitle}</p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Badge
                      pill
                      bg={
                        volunteer.requestStatus === 'Enabled'
                          ? 'success'
                          : 'warning'
                      }
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '0.5rem',
                        color:
                          volunteer.requestStatus === 'Enabled'
                            ? 'white'
                            : 'black',
                        fontSize: '0.6rem',
                        height: '20px',
                        width: '60px',
                      }}
                    >
                      {volunteer.requestStatus}
                    </Badge>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: ' 0.7rem',
                  }}
                >
                  <p style={STYLES.text}>
                    Volunteers Required: {volunteer.volunteersRequired}
                  </p>
                  <p style={{ ...STYLES.text, marginRight: '0.2rem' }}>
                    Duration: {volunteer.timeDuration}
                  </p>
                </div>
              </div>
            );
          })}
          {volunteers.length === 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '2rem',
              }}
            >
              <p>No Requests Found!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const STYLES = {
  text: {
    margin: '0',
    padding: '0',
    color: 'white',
    fontSize: '0.8rem',
  },
};
