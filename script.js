const songs = [
    {
        songName: "Bairen",
        artist: "Banjaare",
        filePath: "songs/1.mp3",
        coverPath: "covers/1.jpg",
        inLibrary: true
    },
    {
        songName: "Sheesha",
        artist: "Mitta Ror",
        filePath: "songs/2.mp3",
        coverPath: "covers/2.jpg",
        inLibrary: false
    },
    {
        songName: "Yaari",
        artist: "Nikk",
        filePath: "songs/3.mp3",
        coverPath: "covers/3.jpg",
        inLibrary: true
    },
    {
        songName: "Soulmate",
        artist: "Badshah, Arijit Singh",
        filePath: "songs/4.mp3",
        coverPath: "covers/4.jpg",
        inLibrary: false
    },
    {
        songName: "Rang Sharbaton Ka",
        artist: "Atif Aslam, Chinmayi",
        filePath: "songs/5.mp3",
        coverPath: "covers/5.jpg",
        inLibrary: true
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

const rightSongName = document.getElementById('rightSongName');
const rightArtistName = document.getElementById('rightArtistName');
const rightCover = document.getElementById('rightCover');

const navHome = document.getElementById('navHome');
const navSearch = document.getElementById('navSearch');
const navLibrary = document.getElementById('navLibrary');
const searchContainer = document.getElementById('searchContainer');
const songSearchInput = document.getElementById('songSearchInput');
const pageTitle = document.getElementById('pageTitle');

function renderSongs(songsToShow) {
    songListContainer.innerHTML = "";
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
            <button class="lib-btn" style="margin-top:8px; padding:5px 10px; font-size:12px; border-radius:20px; border:none; cursor:pointer; background:#1DB954; color:black; font-weight:bold;">
                ${song.inLibrary ? '❤️ In Library' : '+ Add'}
            </button>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('lib-btn')) {
                playSelectedSong(originalIndex);
            }
        });

        const libBtn = card.querySelector('.lib-btn');
        libBtn.addEventListener('click', () => {
            song.inLibrary = !song.inLibrary;
            libBtn.innerText = song.inLibrary ? '❤️ In Library' : '+ Add';
        });

        songListContainer.appendChild(card);
    });
}

renderSongs(songs);

navHome.addEventListener('click', () => {
    setActiveNav(navHome);
    searchContainer.style.display = "none";
    pageTitle.innerText = "Trending Songs";
    renderSongs(songs);
});

navSearch.addEventListener('click', () => {
    setActiveNav(navSearch);
    searchContainer.style.display = "block";
    pageTitle.innerText = "Search Songs";
    songSearchInput.focus();
    renderSongs(songs);
});

songSearchInput.addEventListener('input', () => {
    const query = songSearchInput.value.toLowerCase();
    const filtered = songs.filter(s => 
        s.songName.toLowerCase().includes(query) || 
        s.artist.toLowerCase().includes(query)
    );
    renderSongs(filtered);
});

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

function playSelectedSong(index) {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    
    masterSongName.innerText = songs[songIndex].songName;
    masterArtistName.innerText = songs[songIndex].artist;
    masterCover.src = songs[songIndex].coverPath;

    rightSongName.innerText = songs[songIndex].songName;
    rightArtistName.innerText = songs[songIndex].artist;
    rightCover.src = songs[songIndex].coverPath;
    
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.innerText = "⏸";
}

masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.innerText = "⏸";
    } else {
        audioElement.pause();
        masterPlay.innerText = "▶";
    }
});

audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration) {
        progressBar.value = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    }
});

progressBar.addEventListener('change', () => {
    audioElement.currentTime = (progressBar.value * audioElement.duration) / 100;
});

document.getElementById('nextBtn').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    playSelectedSong(songIndex);
});

document.getElementById('prevBtn').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    playSelectedSong(songIndex);
});

volumeBar.addEventListener('input', () => {
    audioElement.volume = volumeBar.value / 100;
});