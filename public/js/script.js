const addFav = document.querySelector('#add_fav');
const delFav = document.querySelector('#del_fav');

addFav.addEventListener('click', function () {
  const value = this.attrs.value;
  console.log(value);
  // axios.get('/');
});

delFav.addEventListener('click', function () {
  const value = this.attrs.value;
  console.log(value);
});
