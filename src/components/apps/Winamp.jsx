import React, { useState, useRef, useEffect, useCallback } from 'react';

const EQ_PRESETS = {
  flat:       { name: 'Flat',       values: [0,0,0,0,0,0,0,0,0,0] },
  rock:       { name: 'Rock',       values: [5,4,3,1,-1,0,1,3,4,5] },
  pop:        { name: 'Pop',        values: [-1,3,5,6,4,1,-1,-2,-1,0] },
  classical:  { name: 'Classical',  values: [0,0,0,0,0,0,-4,-4,-4,-6] },
  jazz:       { name: 'Jazz',       values: [0,0,2,4,4,4,0,2,3,4] },
  techno:     { name: 'Techno',     values: [5,4,0,-4,-3,0,5,6,6,5] },
  fullBass:   { name: 'Full Bass',  values: [8,7,7,4,1,-3,-5,-6,-7,-7] },
  fullTreble: { name: 'Full Treble',values: [-6,-6,-6,-3,1,6,10,10,10,10] },
  bass_boost: { name: 'Bass Boost', values: [6,5,4,2,0,0,0,0,0,0] },
  vocal:      { name: 'Vocal',      values: [-2,-4,-4,2,5,5,4,2,0,-2] },
};

const EQ_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
const EQ_LABELS = ['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'];

const DEMO_TRACKS = [
  { title: 'Synthwave Dreams', artist: 'NeonByte', duration: 245 },
  { title: 'Retro Horizons', artist: 'PixelRunner', duration: 198 },
  { title: 'Digital Sunset', artist: 'CyberWave', duration: 312 },
  { title: 'Midnight Protocol', artist: 'DataStream', duration: 267 },
  { title: 'Binary Stars', artist: 'NeonByte', duration: 189 },
  { title: 'Chrome Reflections', artist: 'VaporTrace', duration: 224 },
];

export default function Winamp() {
  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [balance, setBalance] = useState(0); // -100 to 100
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false); // 'off', 'all', 'one'
  
  // EQ states
  const [eqEnabled, setEqEnabled] = useState(true);
  const [eqPreset, setEqPreset] = useState('flat');
  const [eqValues, setEqValues] = useState([0,0,0,0,0,0,0,0,0,0]);
  const [preamp, setPreamp] = useState(0);
  const [showPresets, setShowPresets] = useState(false);
  
  // UI states
  const [showEQ, setShowEQ] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [playlist, setPlaylist] = useState([...DEMO_TRACKS]);
  const [scrollText, setScrollText] = useState('');
  const [scrollPos, setScrollPos] = useState(0);
  
  // Visualizer
  const [vizType, setVizType] = useState('bars'); // bars, oscilloscope
  const vizCanvasRef = useRef(null);
  const animFrameRef = useRef(null);
  
  // Web Audio API refs
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const pannerRef = useRef(null);
  const eqFiltersRef = useRef([]);
  const preampGainRef = useRef(null);
  const analyserRef = useRef(null);

  const currentTrack = playlist[currentTrackIndex];

  // Initialize Web Audio API
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = ctx;
    
    // Create analyser
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    
    // Create preamp gain
    const preampGain = ctx.createGain();
    preampGainRef.current = preampGain;
    
    // Create EQ filters
    const filters = EQ_FREQUENCIES.map((freq, i) => {
      const filter = ctx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.Q.value = 1.4;
      filter.gain.value = eqValues[i];
      return filter;
    });
    eqFiltersRef.current = filters;
    
    // Create master gain (volume)
    const gainNode = ctx.createGain();
    gainNode.gain.value = volume / 100;
    gainNodeRef.current = gainNode;
    
    // Create panner
    const panner = ctx.createStereoPanner();
    panner.pan.value = balance / 100;
    pannerRef.current = panner;
    
    // Chain: source -> preamp -> EQ filters -> panner -> gain -> analyser -> destination
    preampGain.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(panner);
    panner.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(ctx.destination);
  }, []);

  // Generate demo audio with oscillators
  const playDemoAudio = useCallback(() => {
    initAudio();
    const ctx = audioContextRef.current;
    
    // Stop previous
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch(e) {}
    }
    
    // Create a pleasant demo tone
    const osc = ctx.createOscillator();
    const baseFreqs = [261.63, 329.63, 392.00, 440.00, 523.25, 587.33];
    osc.type = 'sine';
    osc.frequency.value = baseFreqs[currentTrackIndex % baseFreqs.length];
    
    // Add some harmonics
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = baseFreqs[currentTrackIndex % baseFreqs.length] * 2;
    
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.3;
    
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.15;
    
    osc.connect(oscGain);
    osc2.connect(osc2Gain);
    oscGain.connect(preampGainRef.current);
    osc2Gain.connect(preampGainRef.current);
    
    osc.start();
    osc2.start();
    oscillatorRef.current = osc;
    // Store ref to second oscillator for cleanup
    osc._companion = osc2;
    
    return () => {
      try { osc.stop(); osc2.stop(); } catch(e) {}
    };
  }, [currentTrackIndex, initAudio]);

  // Scroll title text
  useEffect(() => {
    if (!currentTrack) return;
    const text = `${currentTrackIndex + 1}. ${currentTrack.artist} - ${currentTrack.title}  ***  `;
    setScrollText(text);
    setScrollPos(0);
    
    const interval = setInterval(() => {
      setScrollPos(prev => (prev + 1) % text.length);
    }, 200);
    return () => clearInterval(interval);
  }, [currentTrackIndex, currentTrack]);

  // Simulate playback timer
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= currentTrack.duration) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex]);

  // Visualizer
  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !vizCanvasRef.current) return;
    
    const canvas = vizCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (vizType === 'bars') {
        analyser.getByteFrequencyData(dataArray);
        const barWidth = canvas.width / 20;
        for (let i = 0; i < 20; i++) {
          const barHeight = (dataArray[i * 3] / 255) * canvas.height;
          const g = Math.floor((barHeight / canvas.height) * 255);
          ctx.fillStyle = `rgb(${255 - g}, ${g}, 50)`;
          ctx.fillRect(i * (barWidth + 1), canvas.height - barHeight, barWidth, barHeight);
        }
      } else {
        analyser.getByteTimeDomainData(dataArray);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#00FF00';
        ctx.beginPath();
        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    };
    draw();
    
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, vizType]);

  // Update EQ filters
  useEffect(() => {
    eqFiltersRef.current.forEach((filter, i) => {
      if (filter) {
        filter.gain.value = eqEnabled ? eqValues[i] : 0;
      }
    });
  }, [eqValues, eqEnabled]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  // Update balance
  useEffect(() => {
    if (pannerRef.current) {
      pannerRef.current.pan.value = balance / 100;
    }
  }, [balance]);

  // Update preamp
  useEffect(() => {
    if (preampGainRef.current) {
      preampGainRef.current.gain.value = Math.pow(10, preamp / 20);
    }
  }, [preamp]);

  const handlePlay = () => {
    if (!isPlaying) {
      playDemoAudio();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (oscillatorRef.current) {
      try { 
        oscillatorRef.current.stop();
        if (oscillatorRef.current._companion) oscillatorRef.current._companion.stop();
      } catch(e) {}
    }
    setIsPlaying(false);
  };

  const handleStop = () => {
    handlePause();
    setCurrentTime(0);
  };

  const handleNext = () => {
    const wasPlaying = isPlaying;
    handleStop();
    if (shuffle) {
      setCurrentTrackIndex(Math.floor(Math.random() * playlist.length));
    } else {
      setCurrentTrackIndex((currentTrackIndex + 1) % playlist.length);
    }
    setCurrentTime(0);
    if (wasPlaying) setTimeout(handlePlay, 50);
  };

  const handlePrev = () => {
    const wasPlaying = isPlaying;
    handleStop();
    setCurrentTrackIndex(currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1);
    setCurrentTime(0);
    if (wasPlaying) setTimeout(handlePlay, 50);
  };

  const applyPreset = (presetKey) => {
    const preset = EQ_PRESETS[presetKey];
    setEqValues([...preset.values]);
    setEqPreset(presetKey);
    setShowPresets(false);
  };

  const updateEqBand = (index, value) => {
    const newValues = [...eqValues];
    newValues[index] = Number(value);
    setEqValues(newValues);
    setEqPreset('custom');
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const displayText = scrollText ? (scrollText + scrollText).slice(scrollPos, scrollPos + 30) : '';

  return (
    <div className="flex flex-col select-none" style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px' }}>
      {/* ===== MAIN WINDOW ===== */}
      <div className="bg-[#232323] border border-[#444] p-1">
        {/* Title bar */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-1 items-center">
            <span className="text-[#00FF00] font-bold text-[9px]">⚡ Winamp</span>
          </div>
          <div className="flex gap-0.5">
            <button className="text-[#AAA] text-[9px] hover:text-white" onClick={() => setShowEQ(!showEQ)}>EQ</button>
            <button className="text-[#AAA] text-[9px] hover:text-white" onClick={() => setShowPlaylist(!showPlaylist)}>PL</button>
          </div>
        </div>

        {/* Visualizer */}
        <div className="bg-black border border-[#333] mb-1 cursor-pointer" onClick={() => setVizType(v => v === 'bars' ? 'oscilloscope' : 'bars')}>
          <canvas ref={vizCanvasRef} width={250} height={30} className="block w-full" />
        </div>

        {/* Scrolling title + time */}
        <div className="flex items-center justify-between mb-1">
          <div className="bg-black text-[#00FF00] px-1 py-0.5 flex-1 mr-1 overflow-hidden whitespace-nowrap"
            style={{ fontFamily: 'Courier New, monospace', fontSize: '10px', letterSpacing: '0.5px' }}>
            {displayText || 'Winamp 2.x Portfolio Edition'}
          </div>
          <div className="bg-black text-[#00FF00] px-1 py-0.5 font-bold" style={{ fontFamily: 'Courier New', fontSize: '12px' }}>
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Bitrate / Sample info */}
        <div className="flex items-center gap-2 mb-1 text-[#88AA88]" style={{ fontSize: '8px' }}>
          <span>192 kbps</span>
          <span>44 kHz</span>
          <span>stereo</span>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[#AAA] text-[8px] w-6">Vol</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-2 accent-[#00FF00]"
          />
          <span className="text-[#00FF00] text-[8px] w-6">{volume}%</span>
        </div>

        {/* Balance slider */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[#AAA] text-[8px] w-6">Bal</span>
          <input
            type="range"
            min="-100"
            max="100"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="flex-1 h-2 accent-[#00FF00]"
          />
          <span className="text-[#00FF00] text-[8px] w-6">{balance > 0 ? `R${balance}` : balance < 0 ? `L${Math.abs(balance)}` : 'C'}</span>
        </div>

        {/* Seek bar */}
        <div className="mb-1">
          <input
            type="range"
            min="0"
            max={currentTrack?.duration || 100}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full h-2 accent-[#00FF00]"
          />
        </div>

        {/* Transport controls */}
        <div className="flex items-center justify-center gap-1 mb-1">
          <button onClick={handlePrev} className="bg-[#333] hover:bg-[#555] text-white px-2 py-1 rounded text-xs border border-[#555]">⏮</button>
          <button onClick={handlePlay} className="bg-[#333] hover:bg-[#555] text-white px-3 py-1 rounded text-xs border border-[#555]" disabled={isPlaying}>▶</button>
          <button onClick={handlePause} className="bg-[#333] hover:bg-[#555] text-white px-2 py-1 rounded text-xs border border-[#555]">⏸</button>
          <button onClick={handleStop} className="bg-[#333] hover:bg-[#555] text-white px-2 py-1 rounded text-xs border border-[#555]">⏹</button>
          <button onClick={handleNext} className="bg-[#333] hover:bg-[#555] text-white px-2 py-1 rounded text-xs border border-[#555]">⏭</button>
        </div>

        {/* Shuffle / Repeat */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`text-[9px] px-1 py-0.5 rounded ${shuffle ? 'bg-[#00FF00] text-black' : 'bg-[#333] text-[#AAA]'}`}
          >
            🔀 Shuffle
          </button>
          <button
            onClick={() => setRepeat(!repeat)}
            className={`text-[9px] px-1 py-0.5 rounded ${repeat ? 'bg-[#00FF00] text-black' : 'bg-[#333] text-[#AAA]'}`}
          >
            🔁 Repeat
          </button>
        </div>
      </div>

      {/* ===== EQUALIZER WINDOW ===== */}
      {showEQ && (
        <div className="bg-[#232323] border border-[#444] border-t-0 p-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[#00FF00] font-bold text-[9px]">EQUALIZER</span>
              <button
                onClick={() => setEqEnabled(!eqEnabled)}
                className={`text-[8px] px-1 rounded ${eqEnabled ? 'bg-[#00FF00] text-black' : 'bg-[#333] text-[#666]'}`}
              >
                {eqEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="text-[8px] px-1 bg-[#333] text-[#AAA] rounded hover:text-white"
              >
                Presets ▾
              </button>
              {showPresets && (
                <div className="absolute right-0 top-full bg-[#2a2a2a] border border-[#555] z-50 min-w-[120px] shadow-lg">
                  {Object.entries(EQ_PRESETS).map(([key, preset]) => (
                    <div
                      key={key}
                      className={`px-2 py-1 text-[9px] cursor-pointer hover:bg-[#00FF00] hover:text-black ${eqPreset === key ? 'text-[#00FF00]' : 'text-[#AAA]'}`}
                      onClick={() => applyPreset(key)}
                    >
                      {preset.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preamp + 10-band EQ */}
          <div className="flex gap-0.5 items-end">
            {/* Preamp */}
            <div className="flex flex-col items-center">
              <span className="text-[#888] text-[7px] mb-0.5">Pre</span>
              <div className="h-[80px] flex items-center">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={preamp}
                  onChange={(e) => setPreamp(Number(e.target.value))}
                  className="accent-[#00FF00]"
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                    height: '80px',
                    width: '14px',
                  }}
                />
              </div>
              <span className="text-[#00FF00] text-[7px] mt-0.5">{preamp > 0 ? `+${preamp}` : preamp}dB</span>
            </div>

            <div className="w-px bg-[#444] h-[100px] mx-1" />

            {/* 10 EQ bands */}
            {eqValues.map((val, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[#888] text-[6px] mb-0.5">{val > 0 ? `+${val}` : val}</span>
                <div className="h-[80px] flex items-center">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={val}
                    onChange={(e) => updateEqBand(i, e.target.value)}
                    className="accent-[#00FF00]"
                    style={{
                      writingMode: 'vertical-lr',
                      direction: 'rtl',
                      height: '80px',
                      width: '14px',
                    }}
                  />
                </div>
                <span className="text-[#00FF00] text-[6px] mt-0.5">{EQ_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PLAYLIST WINDOW ===== */}
      {showPlaylist && (
        <div className="bg-[#232323] border border-[#444] border-t-0 p-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#00FF00] font-bold text-[9px]">PLAYLIST</span>
            <span className="text-[#888] text-[8px]">{playlist.length} tracks</span>
          </div>
          <div className="bg-black border border-[#333] max-h-[120px] overflow-y-auto">
            {playlist.map((track, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-1 py-0.5 cursor-pointer ${
                  i === currentTrackIndex
                    ? 'bg-[#0000AA] text-white'
                    : 'text-[#00FF00] hover:bg-[#111]'
                }`}
                onDoubleClick={() => {
                  const wasPlaying = isPlaying;
                  handleStop();
                  setCurrentTrackIndex(i);
                  setCurrentTime(0);
                  if (wasPlaying) setTimeout(handlePlay, 50);
                }}
                style={{ fontSize: '9px' }}
              >
                <span className="truncate flex-1">
                  {i + 1}. {track.artist} - {track.title}
                </span>
                <span className="text-[#888] ml-2">{formatTime(track.duration)}</span>
              </div>
            ))}
          </div>
          {/* Playlist controls */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-1">
              <button className="bg-[#333] text-[#AAA] text-[8px] px-1 py-0.5 rounded hover:text-white border border-[#555]"
                onClick={() => {
                  const track = { title: `Track ${playlist.length + 1}`, artist: 'New Artist', duration: Math.floor(Math.random() * 200) + 120 };
                  setPlaylist([...playlist, track]);
                }}>+ Add</button>
              <button className="bg-[#333] text-[#AAA] text-[8px] px-1 py-0.5 rounded hover:text-white border border-[#555]"
                onClick={() => {
                  if (playlist.length > 1) {
                    const newList = playlist.filter((_, i) => i !== currentTrackIndex);
                    setPlaylist(newList);
                    if (currentTrackIndex >= newList.length) setCurrentTrackIndex(newList.length - 1);
                  }
                }}>- Rem</button>
            </div>
            <span className="text-[#888] text-[8px]">
              Total: {formatTime(playlist.reduce((a, t) => a + t.duration, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
