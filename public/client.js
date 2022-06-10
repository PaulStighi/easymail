// console.log('Client running');

// const button = document.getElementById('myButton');

// button.addEventListener('click', function (e) {
//   console.log('button was clicked');

//   let url = new URL('http://localhost:3000/verify/batch');

//   url.searchParams.append('batchId', '62a271c91733c94a2e390d9f');

//   fetch(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(function (response) {
//       if (response.ok) {
//         console.log('Click was recorded');
//         return;
//       }
//       throw new Error('Send failed.');
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });