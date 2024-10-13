import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import swim from '../assets/logos/swim.png';

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

export default function ScrollingText() {
  const scrollRef = useRef(null);
  const [animationDuration, setAnimationDuration] = useState(100);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const viewportWidth = scrollRef.current.offsetWidth;
      const duration = (scrollWidth / viewportWidth) * 25; // Adjust for desired speed
      setAnimationDuration(duration);
    }
  }, []);

  const textAndImage = (
    <>
      <Typography
        variant="h6"
        component="span"
        sx={{ color: 'primary.main', whiteSpace: 'nowrap', mr: 2 }}
      >
        Have a nice swim
      </Typography>
      <img src={swim} alt="Swim" width={24} height={24} style={{ marginRight: '16px' }} />
    </>
  );

  const content = (
    <>
      {[...Array(10)].map((_, index) => (
        <Box key={index} sx={{ display: 'inline-flex', alignItems: 'center' }}>
          {textAndImage}
        </Box>
      ))}
    </>
  );

  return (
    <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', bgcolor: 'background.default' }}>
      <Box
        ref={scrollRef}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          animation: `${scroll} ${animationDuration}s linear infinite`,
        }}
      >
        {content}
        {content}
      </Box>
    </Box>
  );
}
