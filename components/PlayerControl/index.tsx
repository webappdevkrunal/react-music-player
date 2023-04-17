import React, { useEffect, useRef, useState } from "react"
// Component imports
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
// Icon Imports
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward30Icon from '@mui/icons-material/Forward30';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Box, Card, Collapse, IconButton, Slider, Button as MuiButton } from "@mui/material";
import { Button } from "@nextui-org/react";

function Index() {
  // State
  const [time, setTime] = useState<string>('');
  const [timeTrack, setTimeTrack] = useState<string>('');
  const [playBackSpeed, setPlayBackSpeed] = useState<number>(0)
  const [isVolume, setisVolume] = useState<boolean>(true);
  const [isVolumeMute, setisVolumeMute] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.5);
  const [trackProgress, setTrackProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Destructure for conciseness
  const audioSrc = "https://hanzluo.s3-us-west-1.amazonaws.com/music/wuyuwuqing.mp3";

  // Refs
  const audioRef = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("") : undefined
  );

  const isReady = useRef(false);


  const volumeMute = () => isVolumeMute ? setisVolumeMute(false) : setisVolumeMute(true);
  const playPauseHandler = () => isPlaying ? setIsPlaying(false) : setIsPlaying(true);
  const forwardHandler = () => onScrub(trackProgress + 30);
  const backwardHandler = () => onScrub(trackProgress - 10);
  const playbackIncHandler = () => {
    setPlayBackSpeed(playBackSpeed + 0.25);
    if (audioRef.current) {
      audioRef.current.playbackRate = playBackSpeed;
    }
  };
  const playbackDecHandler = () => {
    if (playBackSpeed > 0 && playBackSpeed - 0.25 > 0) {
      setPlayBackSpeed(playBackSpeed - 0.25);
      if (audioRef.current) {
        audioRef.current.playbackRate = playBackSpeed;
      }
    }
  };

  // Destructure for conciseness
  const duration: number = audioRef.current ? audioRef.current.duration : 0;

  const startTimer = () => {

    setInterval(() => {
      audioRef.current && setTrackProgress(audioRef.current?.currentTime);
    }, 1000);
  };

  const onVolumeScrub = (value: number) => {

    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
    }
  };


  const onScrub = (value: number) => {
    // Clear any timers already running

    if (audioRef.current) { audioRef.current.currentTime = value };
    audioRef.current && setTrackProgress(audioRef.current?.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  useEffect(() => {
    if (audioRef.current?.duration) {
      const sec = audioRef.current.duration;
      const trackSec = trackProgress;

      const trackTemp = new Date(trackSec * 1000).toISOString().slice(11, 19);
      const temp = new Date(sec * 1000).toISOString().slice(11, 19);
      setTime(temp);
      setTimeTrack(trackTemp);
    }
  }, [trackProgress])


  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startTimer();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    audioRef.current?.pause();

    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current?.currentTime);
    setVolume(audioRef.current?.volume);
    setPlayBackSpeed(audioRef.current?.playbackRate);
    setTime(new Date(trackProgress * 1000).toISOString().slice(11, 19))

    if (isReady.current) {
      audioRef.current?.pause();
      setIsPlaying(false);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [audioRef.current?.volume, volume])



  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <Card style={{ width: "100%", display: "flex", height: "120px", alignItems: "center", flexDirection: "row", justifyContent: "center" }} >
      <Box style={{ display: "flex", marginRight: "5rem" }}>
        <IconButton color="primary" aria-label="upload picture" component="label" onClick={playPauseHandler}>
          {isPlaying ? <PauseCircleFilledIcon style={{ fontSize: "3rem" }} /> : <PlayCircleIcon style={{ fontSize: "3rem" }} />}
        </IconButton>
      </Box>
      <Box style={{ width: "80%", display: "flex", flexDirection: "column" }}>
        <Box style={{ display: "flex", flexDirection: "column", margin: 0, marginRight: "1rem" }}>
          <Slider
            component={"" as any}
            type="range"
            value={(trackProgress as number)}
            step={1}
            min={0}
            max={(duration as number) || 0}
            onChange={(e) => onScrub(parseInt((e.target as HTMLInputElement).value))}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
          />
        </Box>

        <Box style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: 'space-between', paddingRight: '1rem' }}>
          <Box>
            <Button.Group size="xs" light>
              <MuiButton>{playBackSpeed} x</MuiButton>
              <MuiButton onClick={playbackDecHandler} style={{ marginLeft: 1, marginRight: 1 }} variant="outlined"><RemoveIcon /></MuiButton>
              <MuiButton onClick={playbackIncHandler} variant="outlined"><AddIcon /></MuiButton>
            </Button.Group>
          </Box>
          <Box>
            <IconButton color="primary" aria-label="upload picture" component="label" onClick={backwardHandler}>
              <Replay10Icon />
            </IconButton>
            <IconButton color="primary" aria-label="upload picture" component="label" onClick={forwardHandler}>
              <Forward30Icon />
            </IconButton>
          </Box>
          <Box style={{ display: "flex", flexDirection: "row", justifyContent: "center" }} onMouseEnter={() => setisVolume(true)} onMouseLeave={() => setisVolume(false)}>
            <IconButton color="primary"
              aria-label="upload picture"
              component="label"
              onClick={volumeMute}
            >
              {isVolumeMute ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
            <Box style={{ display: "flex", width: "40vh", justifyContent: "left", alignItems: 'center' }} >
              <Collapse orientation="horizontal" in={isVolume}>
                <Slider
                  component={"" as any}
                  type="range"
                  style={{ width: "30vh" }}
                  value={(volume as number) * 100}
                  step={0.01}
                  min={0}
                  max={100}
                  onChange={(e) => { onVolumeScrub(parseInt((e.target as HTMLInputElement).value) / 100) }}
                />
              </Collapse>
            </Box>
          </Box>
          <Box>
            {timeTrack}/{time}
          </Box>
        </Box>
      </Box>
    </Card>
  )
  // src="https://hanzluo.s3-us-west-1.amazonaws.com/music/wuyuwuqing.mp3"
}

export default Index