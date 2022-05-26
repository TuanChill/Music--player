const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'USER'

const heading = $('header h2');
const audio = $('#audio')
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const playerlist = $('.playlist');
const progressAudio = $('#progress');
const playlistSong = $('.playlist .song');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const repeatBtn = $('.btn-repeat');
const shuffleBtn = $('.btn-shuffle');
const songActived = $('.song.avtive');
const songsPlaylist = $$('.playlist .song');


const app = {
    currentIndex : 0,
    isShuffle: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.getItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh',
            singer: 'ERIK',
            path: './Assets/musics/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3',
            image: './Assets/Img/1.jpg',
        },
        {
            name: 'Đế Vương',
            singer: 'Đình Dũng, ACV',
            path: './Assets/musics/DeVuong-DinhDungACV-7121634.mp3',
            image: './Assets/Img/2.jpg',
        },
        {
            name: 'Chạy Về Nơi Phía Anh',
            singer: 'Khắc Việt',
            path: './Assets/musics/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3',
            image: './Assets/Img/3.jpg',
        },
        {
            name: 'Từng Thương',
            singer: 'Phan PhanDuyAnh, ACV',
            path: './Assets/musics/TungThuong-PhanDuyAnhACV-7196634.mp3',
            image: './Assets/Img/4.jpg',
        },
        {
            name: 'Yêu Em Hơn Mỗi Ngày',
            singer: 'Andiez',
            path: './Assets/musics/YeuEmHonMoiNgay-Andiez-7136374.mp3',
            image: './Assets/Img/5.jpg',
        },
        {
            name: 'Và Ngày Nào Đó',
            singer: 'Andiez',
            path: './Assets/musics/VaNgayNaoDo-StudioPartyQuangTrungVuThaoMy-7146301.mp3',
            image: './Assets/Img/6.jpg',
        },
        {
            name: 'Sao Tiếc Người Không Tốt',
            singer: 'Hoài Lâm, Vương Anh Tú',
            path: './Assets/musics/SaoTiecNguoiKhongTot-HoaiLamVuongAnhTu-7187294.mp3',
            image: './Assets/Img/7.jpg',
        },
        {
            name: 'Có hen với thanh xuân',
            singer: 'MONSTAR',
            path: './Assets/musics/cohenvoithanhxuan-MONSTAR-7050201.mp3',
            image: './Assets/Img/8.jpg',
        },
        {
            name: 'Mẹ Em Nhắc Anh',
            singer: 'Orange, Hamlet Trương',
            path: './Assets/musics/MeEmNhacAnh-OrangeHamletTruong-7136377.mp3',
            image: './Assets/Img/9.jpg',
        },
        {
            name: 'Tệ Thật, Anh Nhớ Em',
            singer: 'Thanh Hưng',
            path: './Assets/musics/TeThatAnhNhoEm-ThanhHung-7132634.mp3',
            image: './Assets/Img/10.jpg',
        },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index= "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function() { 
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function() { 
        heading.innerText = this.currentSong.name;
        audio.src = this.currentSong.path;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    },
    handleEvents: function() {
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        //handle cd rotate
        const cdThumbAnimation = cdThumb.animate([{
            transform: 'rotate(360deg)',
        }], {
            duration: 10000,
            iterations: Infinity,
        });
        cdThumbAnimation.pause()

        // handle cd--thumb
        document.onscroll = function() {
            const scollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth  + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //handle playingbtn
        playBtn.addEventListener('click', function() {
            player.classList.toggle('playing');
            const isPlaying = player.classList.contains('playing');
            if(isPlaying) {
                audio.play();
                cdThumbAnimation.play();
            } else {
                audio.pause();
                cdThumbAnimation.pause();
            }
        })
        // handle playing progress
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progressAudio.value = progressPercent;
            }
        }
        // handle sekk song change
        progressAudio.onchange = function () {
            const seekTime = audio.duration / 100 * progressAudio.value;
            audio.currentTime = seekTime;
        }
        //handle next song 
        nextBtn.addEventListener('click', function() {
            if(app.isShuffle) {
                app.playShuffleSong();
                audio.play();
                player.classList.add('playing');
                cdThumbAnimation.play();
                app.render();
                app.scrollToActiveSong()
            } else {
                app.nextSong();
                audio.play();
                player.classList.add('playing');
                cdThumbAnimation.play();
                app.render()
                app.scrollToActiveSong()
            }
            
        })
        
        //handle prev song
        prevBtn.addEventListener('click', function() {
            if(app.isShuffle) {
                app.playShuffleSong();
                audio.play();
                player.classList.add('playing');
                cdThumbAnimation.play();
                app.render()
                app.scrollToActiveSong()
            } else {
                app.prevSong();
                audio.play();
                player.classList.add('playing');
                cdThumbAnimation.play();
                app.render()
                app.scrollToActiveSong()
            }
            
        })
        // handle on/ off shuffle song 
        shuffleBtn.addEventListener('click', function() {
            app.isShuffle = !app.isShuffle
            app.setConfig('isShuffle', app.isShuffle)
            shuffleBtn.classList.toggle('active', app.isShuffle); 
        })
        // handle on/ off repeat song
        repeatBtn.addEventListener('click', function() {
            app.isRepeat = !app.isRepeat;
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.repeatBtn)
        })
        //handle end song 
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click();
            }
        }
        playerlist.addEventListener('click', function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            const optionSong = e.target.closest('.option');
            if(songNode || optionSong) {
                if(songNode ) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render()
                    player.classList.add('playing');
                    audio.play()
                }
            }
            if(optionSong) {
                console.log(e.target);
            }
        })
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            if(app.currentIndex===0) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth', 
                    block: 'center', 
                })
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth', 
                    block: 'nearest', 
                })
            }
        }) 
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        app.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        app.loadCurrentSong()
    },
    playShuffleSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    start: function() {
        this.defineProperties()
        this.loadCurrentSong()
        this.handleEvents()
        this.render()
    }
}


app.start()