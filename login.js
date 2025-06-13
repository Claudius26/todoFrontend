
const BASE_URL = "http://localhost:8080/api/user";
const login = async ()=>{
  const email = document.querySelector('#emailId').value.trim();
  const password = document.querySelector('#passWordId').value.trim();
  const response = await fetch(`${BASE_URL}/login`,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
      "password": password
      })
  })
  const data = await response.json()
  if(data.data === 'User is already logged in'){
    localStorage.setItem('user', JSON.stringify({ email }));
    window.location.href = '/dashboard.html'
  }
  else if(!data.success){
    alert(data.data)
  }else{
    localStorage.setItem('user', JSON.stringify({email}));
    window.location.href = '/dashboard.html'
  }
}

  document.getElementById("goBack").addEventListener("click", function () {
    window.location.href = '/homepage.html';
  });


  document.querySelector('.login-ButtonJs').addEventListener('click', (e)=>{
  e.preventDefault()
  login()
})
