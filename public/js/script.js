document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  const delButtons = document.querySelectorAll('.btn-del-small');
  const editButtons = document.querySelectorAll('.btn-edit-small');

  console.log({ delButtons, editButtons });

  // delButtons.forEach((button) => {
  //   button.addEventListener('click', function () {
  //     const userId = this.getAttribute('userId');
  //     const storeId = this.getAttribute('storeId');
  //     console.log({ userId, storeId });
  //     axios
  //       .get('/comment/delete/', {
  //         params: {
  //           userId,
  //           storeId,
  //         },
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //         this.parentElement.parentElement.remove();
  //       })
  //       .catch((err) => console.log(err));
  //   });
  // });

  // editButtons.forEach((button) => {
  //   button.addEventListener('click', function () {
  //     const storeId = this.getAttribute('storeId');
  //     const userId = this.getAttribute('userId');
  //     console.log({ userId, storeId });
  //     const comment = this.parentElement.children[0];
  //     axios
  //       .get('/comment/edit/', {
  //         params: {
  //           userId,
  //           storeId,
  //           comment,
  //         },
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //       })
  //       .catch((err) => console.log(err));
  //   });
  // });
});
