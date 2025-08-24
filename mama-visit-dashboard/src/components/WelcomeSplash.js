import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fade,
  Zoom,
  Card,
  CardContent,
} from '@mui/material';
import { keyframes } from '@mui/system';

// Animation keyframes
const heartbeat = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

function WelcomeSplash({ onComplete }) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const messages = [
    {
      emoji: "✈️",
      text: "Мама летит в Америку!",
      subtext: "Скоро встреча..."
    },
    {
      emoji: "💕",
      text: "Я так счастлива!",
      subtext: "Мы так долго этого ждали"
    },
    {
      emoji: "🏠",
      text: "Добро пожаловать!",
      subtext: "Этот сайт создан с любовью для тебя"
    }
  ];

  useEffect(() => {
    // Show first content after initial delay
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Cycle through messages
    const messageTimer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2500);

    // Complete splash screen after all messages
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(messageTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, messages.length]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          fontSize: '2rem',
          animation: `${sparkle} 3s ease-in-out infinite`,
          animationDelay: '0s',
        }}
      >
        ✨
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          fontSize: '1.5rem',
          animation: `${sparkle} 3s ease-in-out infinite`,
          animationDelay: '1s',
        }}
      >
        🌟
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          fontSize: '2.5rem',
          animation: `${float} 4s ease-in-out infinite`,
          animationDelay: '0.5s',
        }}
      >
        💖
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          right: '10%',
          fontSize: '1.8rem',
          animation: `${float} 4s ease-in-out infinite`,
          animationDelay: '2s',
        }}
      >
        🌈
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: '5%',
          fontSize: '1.2rem',
          animation: `${sparkle} 2.5s ease-in-out infinite`,
          animationDelay: '1.5s',
        }}
      >
        🎉
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '5%',
          fontSize: '1.4rem',
          animation: `${float} 3.5s ease-in-out infinite`,
          animationDelay: '0.8s',
        }}
      >
        💫
      </Box>

      {/* Main content */}
      <Fade in={showContent} timeout={1000}>
        <Card
          sx={{
            maxWidth: 500,
            mx: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Zoom in={showContent} timeout={1200}>
              <Box
                sx={{
                  fontSize: '4rem',
                  mb: 2,
                  animation: `${heartbeat} 2s ease-in-out infinite`,
                }}
              >
                {messages[currentMessage].emoji}
              </Box>
            </Zoom>

            <Box
              sx={{
                animation: `${fadeInUp} 1s ease-out`,
                animationDelay: '0.5s',
                animationFillMode: 'both',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  mb: 2,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {messages[currentMessage].text}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  fontStyle: 'italic',
                }}
              >
                {messages[currentMessage].subtext}
              </Typography>
            </Box>

            {/* Progress dots */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {messages.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index === currentMessage ? 'primary.main' : 'grey.300',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>

            <Box
              sx={{
                mt: 3,
                animation: `${fadeInUp} 1s ease-out`,
                animationDelay: '1s',
                animationFillMode: 'both',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                }}
              >
                Сентябрь 2025 • Самая долгожданная встреча 💕
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}

export default WelcomeSplash;
