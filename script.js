
const songs = [
    {
        songName: "Kesariya",
        artist: "Arijit Singh",
        filePath: "songs/1.mp3",
        coverPath: "covers/1.jpg",
        inLibrary: true // Yeh Your Library mein dikhega
    },
    {
        songName: "Apna Bana Le",
        artist: "Arijit Singh",
        filePath: "songs/2.mp3",
        coverPath: "covers/2.jpg",
        inLibrary: false
    },
    {
        songName: "Chaleya",
        artist: "Anirudh Ravichander",
        filePath: "songs/3.mp3",
        coverPath: "covers/3.jpg",
        inLibrary: true // Yeh Your Library mein dikhega
    }
];

let songIndex = 0;
let audioElement = new Audio(songs[0].filePath);

const songListContainer = document.getElementById('songList');
const masterPlay = document.getElementById('masterPlay');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const masterSongName = document.getElementById('masterSongName');
const masterArtistName = document.getElementById('masterArtistName');
const masterCover = document.getElementById('masterCover');

// Navigation Elements
const navHome = document.getElementById('navHome');
const navSearch = document.getElementById('navSearch');
const navLibrary = document.getElementById('navLibrary');
const searchContainer = document.getElementById('searchContainer');
const songSearchInput = document.getElementById('songSearchInput');
const pageTitle = document.getElementById('pageTitle');

// Screen par gaane dikhane ka function
function renderSongs(songsToShow) {
    songListContainer.innerHTML = ""; // Purani list saaf karein
    
    if (songsToShow.length === 0) {
        songListContainer.innerHTML = "<p style='color:#b3b3b3;'>Koi gaana nahi mila...</p>";
        return;
    }

    songsToShow.forEach((song) => {
        const originalIndex = songs.indexOf(song);
        const card = document.createElement('div');
        card.classList.add('song-card');
        card.innerHTML = `
            <img src="${song.coverPath}" alt="${song.songName}">
            <h4>${song.songName}</h4>
            <p>${song.artist}</p>
            <button class="lib-btn" style="margin-top:8px; padding:4px 8px; font-size:12px; border-radius:4px; border:none; cursor:pointer; background:#1DB954; color:white;">
                ${song.inLibrary ? '❤️ In Library' : '+ Add to Playlist'}
            </button>
        `;

        // Card par click karne se gaana chalega
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('lib-btn')) {
                playSelectedSong(originalIndex);
            }
        });

        // Playlist mein add/remove karne ka button
        const libBtn = card.querySelector('.lib-btn');
        libBtn.addEventListener('click', () => {
            song.inLibrary = !song.inLibrary;
            libBtn.innerText = song.inLibrary ? '❤️ In Library' : '+ Add to Playlist';
        });

        songListContainer.appendChild(card);
    });
}

// Shuru mein saare gaane dikhayein
renderSongs(songs);

// 1. HOME BUTTON CLICK
navHome.addEventListener('click', () => {
    setActiveNav(navHome);
    searchContainer.style.display = "none";
    pageTitle.innerText = "Trending Songs";
    renderSongs(songs);
});

// 2. SEARCH BUTTON CLICK
navSearch.addEventListener('click', () => {
    setActiveNav(navSearch);
    searchContainer.style.display = "block";
    pageTitle.innerText = "Search Songs";
    songSearchInput.focus();
    renderSongs(songs);
});

// Type karte hi gaana filter hoga
songSearchInput.addEventListener('input', () => {
    const query = songSearchInput.value.toLowerCase();
    const filtered = songs.filter(s => 
        s.songName.toLowerCase().includes(query) || 
        s.artist.toLowerCase().includes(query)
    );
    renderSongs(filtered);
});

// 3. YOUR LIBRARY (PLAYLIST) BUTTON CLICK
navLibrary.addEventListener('click', () => {
    setActiveNav(navLibrary);
    searchContainer.style.display = "none";
    pageTitle.innerText = "Your Playlist / Library";
    const librarySongs = songs.filter(s => s.inLibrary === true);
    renderSongs(librarySongs);
});

function setActiveNav(activeElement) {
    [navHome, navSearch, navLibrary].forEach(el => el.classList.remove('active'));
    activeElement.classList.add('active');
}

// Gaana chalane ka function
function playSelectedSong(index) {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    masterArtistName.innerText = songs[songIndex].artist;
    masterCover.src = songs[songIndex].coverPath;
    
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.innerText = "⏸";
}

// Play / Pause button
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.innerText = "⏸";
    } else {
        audioElement.pause();
        masterPlay.innerText = "▶";
    }
});

// Progress bar update
audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration) {
        progressBar.value = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    }
});

progressBar.addEventListener('change', () => {
    audioElement.currentTime = (progressBar.value * audioElement.duration) / 100;
});

// Next & Previous buttons
document.getElementById('nextBtn').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    playSelectedSong(songIndex);
});

document.getElementById('prevBtn').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    playSelectedSong(songIndex);
});

// Volume control
volumeBar.addEventListener('input', () => {
    audioElement.volume = volumeBar.value / 100;
});