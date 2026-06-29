const API_URL = 'https://mxtherfxcker-github-io.vercel.app/';

const UPDATE_INTERVAL = 30000;

let updateTimer = null;

async function fetchCurrentTrack() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        console.log('API Response:', data);
        
        if (data.track) {
            return {
                artist: data.track.artist,
                title: data.track.title
            };
        }
        
        return null;
        
    } catch (error) {
        console.error('VK Music API Error:', error);
        return null;
    }
}

function updateMusicDisplay(trackInfo) {
    const musicContainer = document.getElementById('vk-music');
    const trackElement = document.getElementById('music-track');
    
    console.log('Updating display with:', trackInfo);
    console.log('Container:', musicContainer);
    console.log('Track element:', trackElement);
    
    if (!musicContainer || !trackElement) {
        console.error('Elements not found!');
        return;
    }
    
    if (trackInfo) {
        const text = `${trackInfo.artist} — ${trackInfo.title}`;
        trackElement.textContent = text;
        trackElement.title = text;
        musicContainer.classList.remove('hidden');
        console.log('Display updated, container visible');
    } else {
        musicContainer.classList.add('hidden');
        console.log('No track, container hidden');
    }
}

async function loadCurrentTrack() {
    try {
        const trackInfo = await fetchCurrentTrack();
        updateMusicDisplay(trackInfo);
    } catch (error) {
        console.log('VK Music: ошибка -', error);
        updateMusicDisplay(null);
    }
}

function startMusicUpdates() {
    loadCurrentTrack();
    updateTimer = setInterval(loadCurrentTrack, UPDATE_INTERVAL);
}

function stopMusicUpdates() {
    if (updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMusicUpdates);
} else {
    startMusicUpdates();
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopMusicUpdates();
    } else {
        startMusicUpdates();
    }
});

window.addEventListener('beforeunload', stopMusicUpdates);
