import { useZenMode } from '../contexts/ZenModeContext';
import { useEffect, useState } from 'react';

const ZenModeToggleButton = () => {
  const { isZenMode, toggleZenMode } = useZenMode();
  const [warnedAboutFullscreen, setWarnedAboutFullscreen] = useState(false);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
      document.documentElement.msRequestFullscreen();
    }
  };

  const handleToggleZenMode = () => {
    toggleZenMode();
    if (!isZenMode) {
      // If entering Zen Mode, try to request fullscreen
      enterFullscreen();
    }
  };

  useEffect(() => {
    const preventEscExit = (event) => {
      if (event.key === 'Escape' && isZenMode) {
        event.preventDefault();
        alert("You're not allowed to exit fullscreen in Zen Mode!");
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isZenMode) {
        if (!warnedAboutFullscreen) {
          setWarnedAboutFullscreen(true);
          alert("You have exited fullscreen. Please re-enter fullscreen for the best experience.");
        }
        enterFullscreen(); // Prompt re-entry into fullscreen mode
      } else {
        setWarnedAboutFullscreen(false);
      }
    };

    if (isZenMode) {
      document.addEventListener('keydown', preventEscExit);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    } else {
      document.removeEventListener('keydown', preventEscExit);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }

    return () => {
      document.removeEventListener('keydown', preventEscExit);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isZenMode, warnedAboutFullscreen]);

  return (
    <button
      onClick={handleToggleZenMode}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 15px',
        backgroundColor: isZenMode ? '#FF6347' : '#4CAF50',
        color: '#FFF',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      {isZenMode ? 'Exit Zen Mode' : 'Enter Zen Mode'}
    </button>
  );
};

export default ZenModeToggleButton;
