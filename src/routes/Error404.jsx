import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Error404Animation from '../assets/animations/error-404.json';
import { useLottie } from 'lottie-react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const [time, setTime] = useState(3);

  const navigate = useNavigate();

  const options = {
    animationData: Error404Animation,
    loop: true,
    autoplay: true,
    style: {
      width: '30%',
    },
  };

  const { View } = useLottie(options);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time === 0) {
      navigate('/');
    }
  }, [time, navigate]);

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {View}
      <h4>
        Redirecting in {time} {time > 1 ? 'seconds' : 'second'}
      </h4>
    </Container>
  );
}
