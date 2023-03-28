import React from 'react';
import { GLOBALSTYLES as GS } from '../../utils/styles';
import { Badge, Spinner } from 'react-bootstrap';

export default function LeftPane({
  resources,
  handleSelectResource,
  activeResource,
  radioValue,
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
          {resources.map((resource) => {
            return (
              <div
                key={resource._id}
                style={{
                  backgroundColor:
                    activeResource._id === resource._id
                      ? GS.secondary
                      : GS.primary,
                  borderRadius: '0.2rem',
                  padding: '0.5rem',
                  margin: '0.5rem 0.3rem',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectResource(resource)}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <p style={STYLES.text}>{resource.resourceName}</p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Badge
                      pill
                      bg='white'
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'black',
                        fontSize: '0.6rem',
                        height: '20px',
                        width: '55px',
                      }}
                    >
                      {resource.userType.charAt(0).toUpperCase() +
                        resource.userType.slice(1)}
                    </Badge>

                    {(radioValue === '3' || radioValue === '4') && (
                      <Badge
                        pill
                        bg={
                          resource.requestStatus === 'Approved'
                            ? 'success'
                            : 'warning'
                        }
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: '0.5rem',
                          color:
                            resource.requestStatus === 'Approved'
                              ? 'white'
                              : 'black',
                          fontSize: '0.6rem',
                          height: '20px',
                          width: '60px',
                        }}
                      >
                        {resource.requestStatus}
                      </Badge>
                    )}
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
                    Quantity: {resource.resourceQuantity}
                  </p>
                  <p style={{ ...STYLES.text, marginRight: '0.2rem' }}>
                    Duration: {resource.resourceDuration}
                  </p>
                </div>
              </div>
            );
          })}
          {resources.length === 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '2rem',
              }}
            >
              <p>No requests found!</p>
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
