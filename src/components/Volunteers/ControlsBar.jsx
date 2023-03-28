import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { GLOBALSTYLES as GS } from '../../utils/styles';

export default function ControlsBar({ radios, radioValue, setRadioValue }) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: GS.primary,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '0.5rem',
      }}
      id='controls-row'
    >
      <p
        style={{
          margin: '0',
          padding: '0.5rem',
          color: 'white',
        }}
      >
        Volunteer Requests
      </p>
      <div
        style={{
          margin: '0',
          padding: '0.5rem',
        }}
      >
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type='radio'
              variant='light'
              name='radio'
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => {
                setRadioValue(e.currentTarget.value);
              }}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
}
