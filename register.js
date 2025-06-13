
const BASE_URL = "http://localhost:8080/api/user";

const getRegisterInfo = () => {

  return formData = {
    "firstname": `${document.querySelector('#firstName').value}`,
    "lastname": `${document.querySelector('#lastName').value}`,
    "email": `${document.querySelector('#emailId').value}`,
    "password": `${document.querySelector('#passwordId').value}`
  };

}

const register = async (form) => {


  const response = await fetch(`${BASE_URL}/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form)
    })
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('user', JSON.stringify(data.data));
    window.location.href = '/dashboard.html'
  }
  else {
    alert(data.data)
  }
}

document.querySelector('#goBack').addEventListener('click', ()=>{
  window.location.href = '/index.html'
})

document.querySelector('.registerButtonJs').addEventListener('click', (e)=>{
  e.preventDefault();
  register(getRegisterInfo())
})