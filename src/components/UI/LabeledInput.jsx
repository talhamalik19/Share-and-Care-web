import React from 'react';
import { Form } from 'react-bootstrap';

export default function LabeledInput({
  className,
  type,
  controlId,
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  style,
  containerStyle,
  as,
  containerAs,
  bottomText,
  maxLength,
  minLength,
}) {
  return (
    <Form.Group
      className={'mb-2'}
      style={containerStyle ?? {}}
      controlId={controlId}
      as={containerAs ?? 'div'}
    >
      <Form.Label
        style={{
          fontSize: '0.8rem',
          margin: 0,
        }}
        title={
          label.endsWith('*')
            ? 'This field is required'
            : 'This field is optional'
        }
      >
        {label}
      </Form.Label>
      <Form.Control
        size='sm'
        style={style}
        as={as}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? ''}
        required={required ?? false}
        disabled={disabled ?? false}
        maxLength={maxLength ?? 100}
        minLength={minLength ?? 0}
        title={
          disabled
            ? 'This field is disabled'
            : label.endsWith('*')
            ? `Enter ${label.slice(0, -2)} here`
            : `Enter ${label} here`
        }
      />
      {bottomText && <Form.Text className='text-muted'>{bottomText}</Form.Text>}
    </Form.Group>
  );
}
