'use strict';

// Data ----------------

const account1 = {
  owner: 'Vedant Gour',
  movements: [2000, 455.23, -306.5, 25000, -642.21, -1133.9, 79.97, 1300],
  interestRate: 5.6, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-04-20T17:01:17.194Z',
    '2023-04-25T16:36:17.929Z',
    '2023-04-26T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account2 = {
  owner: 'Amit Verma',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 2.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2022-03-10T14:43:26.374Z',
    '2023-04-20T18:49:59.371Z',
    '2023-04-24T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  //en-IN
};

const account3 = {
  owner: 'Shivani Kherde',
  movements: [2000, 455.23, -306.5, 25000, -642.21, -1133.9, 79.97, 1300],
  interestRate: 7.2, // %
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-04-20T17:01:17.194Z',
    '2023-04-25T16:36:17.929Z',
    '2023-04-26T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account4 = {
  owner: 'Ritika Gupta',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 3.2,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2022-03-10T14:43:26.374Z',
    '2023-04-20T18:49:59.371Z',
    '2023-04-24T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//formatting dates
const formatMovementDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    //manual way of formating dates
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//currency formatter with Internationalization API
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//sort movements
const sortMovements = function (movs, dates) {
  const arrCombined = [],
    sortedMovs = [],
    sortedDates = [];

  movs.forEach((el, i) => arrCombined.push([movs[i], dates[i]]));
  arrCombined.sort((a, b) => a[0] - b[0]);
  arrCombined.forEach(el => {
    sortedMovs.push(el[0]);
    sortedDates.push(el[1]);
  });

  return [sortedMovs, sortedDates];
};

//diplay the transactions
const displayMovements = function (acc, sort = false) {
  //remove initial transactions which have written in HTML
  containerMovements.innerHTML = '';

  const [moves, dates] = sort
    ? sortMovements(acc.movements, acc.movementsDates)
    : [acc.movements, acc.movementsDates];

  //build our movement element from the given array of movements
  moves.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //format date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDates(new Date(dates[i]));

    //format currency
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    //used afterbegin so that the new transaction would come on top becaue afterbeginwill keep adding the element at the begining of the element i.e top
  });
};

//Total balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  //format currency and display balance
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

//summary
const calcDisplaySummary = function (acc) {
  //calculate income
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(income, acc.locale, acc.currency);

  //calculate withdrawls
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  //to calculate intrest on deposits
  //condition: bank only give intrest if the any of deposit is greater than 1000 rs which is the 2nd filter method below
  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(currIntrest => currIntrest > 1000)
    .reduce((acc, currIntrest) => acc + currIntrest, 0);

  labelSumInterest.textContent = formatCur(intrest, acc.locale, acc.currency);
};

//create usernames
// convert to lower case
// split so that we get an array of strings
// map method with arrow func to iterate on the array return the initial of every element
// join the arry to produce a string
//basically we are creating a property username on our account object using forEach (because this time we needed to manipulate the original array)
// ⬇️👇

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//changing the numbers
const updateUI = function (acc) {
  // display movements
  displayMovements(acc);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
};

//logout Timer
const startLogoutTimer = function () {
  //Set the time to 10 minutes
  let time = 600;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    //In each call, print the remaining time to UI(like countdown)
    labelTimer.textContent = `${min}:${sec}`;
    //When time is over i.e reached 0 secs then stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      //display UI
      containerApp.style.opacity = 0;
      setTimeout(() => {
        alert('You were logged out due to inactivity');
      }, 500);
    }
    //Decrease 1 Sec every time
    time--;
  };
  //Call the timer every sec
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Login funactionality
let currentAccount;
let timer;

btnLogin.addEventListener('click', function (e) {
  //preventing the from from submitting automatically
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // ? --> optional chaining => pin will be only read if the currentAccount exists !!!!!!
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //welcome message => welcome back and the first name only
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    //display UI
    containerApp.style.opacity = 100;

    //current balance date ==> Manual way
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //current balance date ==> Internationalization API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //use 'long' to display full month ==> Janaury
      year: 'numeric',
      // weekday: 'short', //use 'long' to display full weekday ==> Wednesday
    };

    // to dynamically know the locale of the user from their browser
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // clear the input fields as we login
    inputLoginUsername.value = inputLoginPin.value = '';
    // to loose its focus / disable cursor
    inputLoginPin.blur();
    //If timer is running then clear it and else start logout timer
    if (timer) {
      clearInterval(timer);
    }
    timer = startLogoutTimer();
    //updateUI
    updateUI(currentAccount);
  } else {
    alert('Invalid Credentials / User does not exist');
    // clear the input fields as we login
    inputLoginUsername.value = inputLoginPin.value = '';
    // to loose its focus / disable cursor
    inputLoginPin.blur();
  }
});

//transfer money
btnTransfer.addEventListener('click', function (e) {
  //preventing the from from submitting automatically
  e.preventDefault();
  //get the amount
  const amount = Number(inputTransferAmount.value);
  //find the user
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //clear the input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  //check wether the input amount is positive and the user have the balance to transfer or not and also we should not be able to transfer to ourself
  if (!receiverAcc) {
    alert('Invalid username');
    //Reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  if (amount <= 0) {
    alert('Enter a valid amount');
    //Reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  if (currentAccount.balance < amount) {
    alert('Insufficient balance');
  }
  if (
    receiverAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //deduct fron sender
    currentAccount.movements.push(-amount);
    // credit/add to receiver
    receiverAcc.movements.push(amount);
    //Add transfer date to both acc, sender and receiver
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    //updateUI
    updateUI(currentAccount);
    //Reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

//request loan
//bank has a rule where it grants a loan if there is atleast one deposit which is atleast 10% of the requested loan amount
btnLoan.addEventListener('click', function (e) {
  //preventing the from from submitting automatically
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //setTimeout because bank should take 5 sec to approve the loan
    setTimeout(function () {
      //credit in our account
      currentAccount.movements.push(amount);
      //Add transfer date to our acc
      currentAccount.movementsDates.push(new Date().toISOString());
      //updateUI
      updateUI(currentAccount);
      //Reset the timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 5000);
  } else {
    alert('Enter a valid amount');
    //Reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  //clear the input field
  inputLoanAmount.value = '';
});

//close account
btnClose.addEventListener('click', function (e) {
  //preventing the from from submitting automatically
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  //clear the input fields
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

//sort button
let sorted = false;
btnSort.addEventListener('click', function (e) {
  //preventing the from from submitting automatically
  e.preventDefault();
  //if already sorted then do reverse sort
  displayMovements(currentAccount, !sorted);
  //again flip the sorted state
  sorted = !sorted;
});
