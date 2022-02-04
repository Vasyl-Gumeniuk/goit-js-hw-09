import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
// import Notiflix from 'notiflix';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
const refs = {
    BtnStartEl: document.querySelector('button[data-start]'),
    inputDays: document.querySelector('.field [data-days]'),
    inputHours: document.querySelector('.field [data-hours]'),
    inputMinutes: document.querySelector('.field [data-minutes]'),
    inputSeconds: document.querySelector('.field [data-seconds]'),
}

const SELECTED_DATA = 'selected-data-item';
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minDate: "today",
  minuteIncrement: 1,
    onClose(selectedDates) {
    localStorage.setItem(SELECTED_DATA, selectedDates[0]);
  },
};

const fp = flatpickr("#datetime-picker", options);
const ACTION_DELAY = 1000;


class Timer {
    constructor({onTick}) {
        this.intervalId = null;
        this.isActive = false;
        this.onTick = onTick;
    };
    start() {
        if (this.isActive) {
            return;
        }
        const startTimeEl = Date.parse(localStorage.getItem(SELECTED_DATA));
        this.isActive = true;

        this.intervalId = setInterval(() => {
            const currentTimeEl = Date.now();
            const deltaTime = startTimeEl - currentTimeEl;
            if (deltaTime <= 1) {
                return;
            }
            const time = this.convertMs(deltaTime);
            
            this.onTick(time);
            console.log(deltaTime);
        }, ACTION_DELAY);
    };
    convertMs(ms) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        
        const days = this.addLeadingZero(Math.floor(ms / day));
        const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
        const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
        const seconds = this.addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

        return { days, hours, minutes, seconds };
    };
    addLeadingZero(value) {
        return String(value).padStart(2, '0');
    };
};

const timer = new Timer({
    onTick: renderInterface,
});

function renderInterface ({ days, hours, minutes, seconds }) {
    refs.inputDays.textContent = `${days}`;
    refs.inputHours.textContent = `${hours}`;
    refs.inputMinutes.textContent = `${minutes}`;
    refs.inputSeconds.textContent = `${seconds}`;
};

refs.BtnStartEl.addEventListener('click', timer.start.bind(timer));

// const timer = {
//     intervalId: null,
//     isActive: false,
//     start() {
//         if (this.isActive) {
//             return;
//         }
//         const startTimeEl = Date.parse(localStorage.getItem(SELECTED_DATA));
//         this.isActive = true;

//         this.intervalId = setInterval(() => {
//             const currentTimeEl = Date.now();
//             const deltaTime = startTimeEl - currentTimeEl;
//             const { days, hours, minutes, seconds } = convertMs(deltaTime);
//             refs.inputDays.textContent = `${days}`;
//             refs.inputHours.textContent = `${hours}`;
//             refs.inputMinutes.textContent = `${minutes}`;
//             refs.inputSeconds.textContent = `${seconds}`;
//             console.log(`${days}:${hours}:${minutes}:${seconds}`);
//         }, ACTION_DELAY);
//     }
// };