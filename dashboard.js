

const inputValue = document.getElementById('textInput');

 const tasksContainer = document.querySelector('.tasksContainer')


let currentAction = null;

const BASE_URL = "http://localhost:8080/api/user";

function getPlaceholderText(action) {
  switch (action) {
    case 'add':
      return 'Enter a task to add';
    case 'delete':
      return 'Enter a task to delete';
    case 'view':
      return 'Enter a task to view';
    default:
      return '';
  }
}
 const getTaskToAdd = () =>{
    return {
            "userEmail": getCurrentUserEmail(),
            "taskToAdd": inputValue.value
          }
   
  }


const addToTask = async (addTodo) =>{
  const response = await fetch(`${BASE_URL}/addTodo`,
    {
      method: 'post',
      headers :{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addTodo)

    }
  )
  const data = await response.json()
  if (!data.success) {
    alert(data.data);
  } 
  else{
    alert(`Task added to your list successfully`);
  }
  
}

const deleteTask = async () =>{
  const task = inputValue.value;
  if(!task) return alert('Enter text to delete');

  const response = await fetch(`${BASE_URL}/deleteTask`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(getTaskToAdd())
    })

    const data = await response.json()
    if (!data.success) {
      alert(data.data);
    }
    else{
      alert(`${task} deleted successfully`);
    }

}

const viewTask = async () =>{
  const task = inputValue.value
  if(!task) return alert('Enter text to view')
  const response = await fetch(`${BASE_URL}/viewTask?userEmail=${getCurrentUserEmail()}&taskToView=${inputValue.value}`,{
  method: 'GET'
  })
  console.log(getCurrentUserEmail())
  const data = await response.json()
  if (!data.success) {
    alert(data.data);
  }
  else{
    const isCompleted = isDone(data.data.isDone);
    tasksContainer.innerHTML = '';
   const taskData = data.data;
   const taskTodo = document.createElement('div')
   taskTodo.innerHTML = `
    <div class="tasks">
              <input type="checkbox" class="markCheckBox" ${isCompleted ? 'checked disabled' : ''}>
              <div class="todoDiv">
                 <p class="elementValue"><strong>Task:</strong><span class="taskToAccomplish"> ${taskData.task}</span></p>
                <p><strong>Created:</strong> ${taskData.dateCreated}</p>
              </div>
            </div>
   `
   taskTodo.classList.add = 'task-todo'
   tasksContainer.appendChild(taskTodo)
  }
}

function isDone(text){
  return text.toLowerCase() === 'true';
}

const deleteUnfinshedTask = async () =>{
 
  const response = await fetch(`${BASE_URL}/deleteUnifinishedTask?userEmail=${getCurrentUserEmail()}`,{
    method: 'DELETE'
  })
  const data = await response.json()
  if (!data.success) {
    alert(data.data);
  }else{
    alert('Unfinshed tasks cleared')
    tasksContainer.innerHTML = '';
  }

}

const deleteFinishedTask = async () =>{
  const response = await fetch(`${BASE_URL}/deleteFinishedTask?userEmail=${getCurrentUserEmail()}`,{
    method: 'DELETE'
    })
    const data = await response.json()
    if (!data.success) {
      alert(data.data);
    }
    else{
      alert('Finished tasks cleared')
      tasksContainer.innerHTML = '';
    }
}


const viewFinishedTasks = async ()=>{

 const response = await fetch(`${BASE_URL}/viewCompletedTask?userEmail=${getCurrentUserEmail()}`,{
  method: 'GET'
  })
  const data = await response.json()
  if(!data.success){
    alert(data.data);
    console.log(data)
  }else{
   tasksContainer.innerHTML = '';
   const taskData = data.data;

   taskData.forEach(element => {
    const taskTodo = document.createElement('div')
    taskTodo.innerHTML = `
    <div class="tasks">
              <input type="checkbox" class="markCheckBox" checked disabled>
              <div class="todoDiv">
                <p class="elementValue"><strong>Task:</strong><span class="taskToAccomplish"> ${element.task}</span></p>
                <p><strong>Created:</strong> ${element.dateCreated}</p>
              </div>
            </div>
   `
   taskTodo.classList.add = 'task-todo'
   tasksContainer.appendChild(taskTodo)
   });
   
  }

}

const viewIncompleteTasks = async ()=>{
  const response = await fetch(`${BASE_URL}/viewUnfinishedTask?userEmail=${getCurrentUserEmail()}`,{
    method: 'GET'
  })
  const data = await response.json()
  if(!data.success){
    alert(data.data);
  }
  else{
   tasksContainer.innerHTML = '';
   const taskData = data.data;

   taskData.forEach(element => {
    const taskTodo = document.createElement('div')
    taskTodo.innerHTML = `
    <div class="tasks">
              <input type="checkbox" class="markCheckBox">
              <div class="todoDiv">
                <p class="elementValue"><strong>Task:</strong><span class="taskToAccomplish"> ${element.task}</span></p>
                <p><strong>Created:</strong> ${element.dateCreated}</p>
              </div>
            </div>
   `
   taskTodo.classList.add = 'task-todo'
   tasksContainer.appendChild(taskTodo)
   });
   
  }
}

function getCurrentUserEmail (){
  const user = JSON.parse(localStorage.getItem('user'))
  return user.email.trim().toLowerCase()
}

const logOut = async ()=>{
  const response = await fetch(`${BASE_URL}/logOut`,{
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({currentUserEmail: getCurrentUserEmail()})
      
    })
    const data = await response.json();
    if(!data.success){
      alert(data.data);
      }
      else{
        localStorage.removeItem('user');
      }
}

tasksContainer.addEventListener('click', async (e) => {
  if (e.target.classList.contains('markCheckBox')) {
    const checkbox = e.target;
    const taskElement = checkbox.closest('.tasks').querySelector('.taskToAccomplish');
    const taskText = taskElement.textContent;


    const response = await fetch(`${BASE_URL}/markTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({userEmail: getCurrentUserEmail(),
      taskToAdd : taskText.trim()
      })
      
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.data);
      checkbox.checked = false;
    } else {
      checkbox.checked = true;
      taskElement.style.color = 'blue';
      taskElement.style.textDecoration = 'line-through';
    }
  }
});




  document.querySelector('.addTask').addEventListener('click', ()=>{
    switchInput('add')
  });


  document.querySelector('.deleteATask').addEventListener('click', ()=>{
    switchInput('delete')
  });

  document.querySelector('.viewATask').addEventListener('click', ()=>{
    switchInput('view');
  });

  document.querySelector('.deleteUnfinshedTask').addEventListener('click', ()=>{
    document.querySelector('.confirmBox').style.display = 'block';
  }
  );

  document.getElementById('confirmYes').addEventListener('click', ()=>{
    deleteUnfinshedTask()
    document.querySelector('.confirmBox').style.display = 'none';
  }
  );

  document.getElementById('confirmNo').addEventListener('click', () => {
  document.querySelector('.confirmBox').style.display = 'none';
  });

  document.querySelector('.deleteFinishedTask').addEventListener('click', ()=>{
    deleteFinishedTask()
  }  
  );

  document.querySelector('.viewCompletedTask').addEventListener('click', ()=>{
    viewFinishedTasks();
  })

  document.querySelector('.viewIncompleteTasks').addEventListener('click', ()=>{
    viewIncompleteTasks();
  })

  document.querySelector('.logOutButtonJs').addEventListener('click', ()=>{
    logOut();
    window.location.href = '/loginPage.html';
  })

   document.getElementById("goBack").addEventListener("click", function () {
    window.history.back();
  });


  function switchInput(action){
    const inputContainer = document.querySelector('.inputContainerJs');
    if(inputContainer.style.display === 'block' && currentAction === action) {
      inputContainer.style.display = 'none';
      currentAction = null;
    }
    else{
    tasksContainer.innerHTML = '';
    inputContainer.style.display = 'block';
    inputValue.placeholder = getPlaceholderText(action)
    inputValue.focus();
    currentAction = action;
    }

  }

  inputValue.addEventListener('keyup', function (e){
    if (e.key === 'Enter'){

          if(currentAction === 'add'){
          addToTask(getTaskToAdd());
          }
          else if(currentAction === 'delete'){
            deleteTask();
          }
          else if(currentAction === 'view'){
            viewTask()
          }
          inputValue.value = '';
          inputContainer.style.display = 'none';
          currentAction = null;
    }
  })

  
