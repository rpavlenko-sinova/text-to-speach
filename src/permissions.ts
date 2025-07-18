navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    /* granted */
  })
  .catch((err) => {
    /* denied */
  });
