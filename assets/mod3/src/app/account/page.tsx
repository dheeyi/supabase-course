useEffect(() => {
  fetch('/api/user/create-profile')
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        console.error('error al crear el perfil del usuario');
      }
    })
    .catch(console.error);
}, []);
