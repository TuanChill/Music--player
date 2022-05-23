const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2');
const audio = $('#audio')
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progressAudio = $('#progress');
const playlistSong = $('.playlist .song');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex : 0,
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
        const htmls = this.songs.map((song) => {
            return `
            <div class="song ">
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
        // handle next song 
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
            console.log(seekTime);
            audio.currentTime = seekTime;
        }
        //handle next song 
        nextBtn.addEventListener('click', function() {
            app.nextsong();
            audio.play();
            cdThumbAnimation.play()
        })
        //handle prev song
        prevBtn.addEventListener('click', function() {
            app.prevSong();
        })
    },
    nextsong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length - 1) {
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
    start: function() {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
    }
}


app.start()