import { v4 as uuidV4 } from 'uuid'

type Task = { 
  id: string, 
  title: string, 
  completed: boolean, 
  createdAt: Date 
}

const list = document.querySelector<HTMLUListElement>('#task-list')
const form = document.getElementById('new-task-form') as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>('#new-task-title')
const deleteBtn = document.getElementById('delete-btn') as HTMLButtonElement | null
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask)

  addListItem(newTask)
  input.value = ""
  saveTasks()
})

function addListItem(task: Task) {
  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  const deleteBtn = document.createElement("button")
  deleteBtn.innerText = "X"
  deleteBtn.setAttribute("id", "delete-btn")

  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked
    saveTasks()
  })
  checkbox.type = 'checkbox'
  checkbox.checked = task.completed

  label.append(checkbox, task.title)
  item.append(label)
  list?.append(item)
  list?.append(deleteBtn)

  deleteBtn.addEventListener('click', () => {
    deleteItem(task)
  })
}

function deleteItem(task: Task) {

  let currentTasks = JSON.parse(localStorage.getItem('TASKS')  || '{}')
  currentTasks = currentTasks.filter(function(elem: { id: string }) {
    return elem.id !== task.id;
  });
    
  localStorage.setItem("TASKS",JSON.stringify(currentTasks));
  location.reload()

  // aqui não podemos deletar a array toda, então teremos que recriar a lista sem o item em questão
  // utilizei uma versão da solução abaixo 
  // https://codepen.io/szymongabrek/pen/QMmeyQ
}
  

function saveTasks() {
  localStorage.setItem('TASKS', JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem('TASKS')
  if (taskJSON == null) return []
  return JSON.parse(taskJSON)
}

const deleteAllBtn = document.getElementById('delete-all-btn')
deleteAllBtn?.addEventListener('click', deleteList)

function deleteList() {
  const result = confirm('Delete the whole list?')
  if (result) {
    localStorage.removeItem('TASKS')
    location.reload()
  }
}
