let todos = JSON.parse(localStorage.getItem("todo-list"));
const arr = todos || [];
// get DOM item
const elForm = document.querySelector(".todo-form");
const elTaskInput = elForm.querySelector(".task-input");
const elList = document.querySelector(".task-collection");
const elTemplate = document.querySelector(".todo-template").content;

const elAlertText = document.querySelector(".alert");

//get Modal
const elModalForm = document.querySelector(".modal-form");
const elModalInput = elModalForm.querySelector(".modal-input");

//get Count
const elAllCount = document.querySelector(".all");
const elCompleteCount = document.querySelector(".completed");
const elUncompleteCount = document.querySelector(".uncompleted");

//Fragment
const newFragment = new DocumentFragment();


let initialId = 0;

elForm.addEventListener("submit", function (evt){
    evt.preventDefault();
    const taskInputValue = elTaskInput.value.trim();

    if(taskInputValue){
        displayAlertSuccess("Add item to the list", "success");

        arr.push({
            id: ++initialId,
            task: taskInputValue,
            isCompleted: false
        });
        console.log(arr);
        elList.innerHTML = "";
        renderTodo(arr);
        localStorage.setItem("todo-list", JSON.stringify(arr));
    } else{
        displayAlertWarning("Please enter value", "danger")
    }

});

function displayAlertSuccess(text, action){
    elAlertText.textContent = text;
    elAlertText.classList.remove("alert-danger");
    elAlertText.classList.add(`alert-${action}`, "alert-show");

    setTimeout(() => {
        elAlertText.classList.remove(`alert-${action}`, "alert-show");
    }, 2000);
}

function displayAlertWarning(text, action){
    elAlertText.textContent = text;
    elAlertText.classList.remove("alert-danger");
    elAlertText.classList.add(`alert-${action}`, "alert-show");

    setTimeout(() => {
        elAlertText.classList.remove(`alert-${action}`, "alert-show");
    }, 2000);
};

function renderTodo(todos){
    elList.innerHTML = "";
    elAllCount.textContent = todos.length;
    
    const filterComplete = todos.filter(function (item){
        return item.isCompleted;
    });

    elUncompleteCount.textContent = filterComplete.length;
    elCompleteCount.textContent = todos.length - filterComplete.length;

    todos.forEach((item, index) => {
        const templateClone = elTemplate.cloneNode(true);

        const userItem = templateClone.querySelector(".task-item");
        templateClone.querySelector(".task-id").textContent = index + 1;
        const userTask = templateClone.querySelector(".task-title");
        userTask.textContent = item.task;
        templateClone.querySelector(".delete-btn").dataset.id = index;
        templateClone.querySelector(".edit-btn").dataset.id = index;
        const checkInput = templateClone.querySelector(".check-input")
        checkInput.dataset.id = index;

        newFragment.appendChild(templateClone);

        if(item.isCompleted){
            checkInput.checked = true;
            userItem.style.opacity = "0.7"
            userTask.style.textDecoration = "line-through";
        }

    });
    elList.appendChild(newFragment);
    localStorage.setItem("todo-list", JSON.stringify(arr));
};

let editingId;
elList.addEventListener("click", function (evt){
    if(evt.target.matches(".delete-btn")){
      const getBtnId = Number(evt.target.dataset.id);
      arr.splice(getBtnId, 1);
        localStorage.setItem("todo-list", JSON.stringify(arr));
        renderTodo(arr);
    }

    if(evt.target.matches(".edit-btn")){
        const getObjId = Number(evt.target.dataset.id);
        const foundObj = arr.find(function (item, index) {
            return index === getObjId
        });

        editingId = foundObj.id;
        elModalInput.value = foundObj.task;
    };

    if(evt.target.matches(".check-input")){
        const getCheckInputId = Number(evt.target.dataset.id);
        const foundCheckObj = arr.find(function (item, index){
            return index === getCheckInputId;
        })
        foundCheckObj.isCompleted = !foundCheckObj.isCompleted;
        localStorage.setItem("todo-list", JSON.stringify(arr));
        renderTodo(arr);
    }

});

renderTodo(arr)




elModalForm.addEventListener("submit", function (evt){
    evt.preventDefault();
    const modalInputValue = elModalInput.value.trim();

    const foundItem = arr.find(function (item){
        return item.id === editingId;
    });
    foundItem.task =    modalInputValue;
    localStorage.setItem("todo-list", JSON.stringify(arr));
    renderTodo(arr);
})


