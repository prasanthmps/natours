/*eslint-disable*/
// import axios from 'axios';

const login = async (email, password) => {
  try {
    console.log(email, password);
    const res = await axios({
      method: 'POST',
      //   {{URL}}/api/v1/users/login
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
