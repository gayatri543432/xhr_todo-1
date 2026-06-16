

const cl = console.log;

const todoForm = document.getElementById('todoForm');
const titleControl = document.getElementById('title');
const completedControl = document.getElementById('completed');
const userIdControl = document.getElementById('userId');
const addTodoBtn = document.getElementById('addTodoBtn');
const updateTodoBtn = document.getElementById('updateTodoBtn');
const todosContainer = document.getElementById('todosContainer');
const spinner = document.getElementById('spinner');

let todosArr = [];

function snackBar(msg, i) {
    Swal.fire({
        title: msg,
        icon: i,
        timer: 3000
    });
}

let BASE_URL = 'https://jsonplaceholder.typicode.com';
let POST_URL = `${BASE_URL}/todos`;

function fetchTodos() {

    spinner.classList.remove('d-none');

    let xhr = new XMLHttpRequest();
    xhr.open('GET', POST_URL);
    xhr.send(null);

    xhr.onload = function () {

        spinner.classList.add('d-none');

        if (xhr.status >= 200 && xhr.status <= 299) {

            let res = JSON.parse(xhr.response);
            todosArr = res;
            createTodo([...res].reverse());
            $(function () {
                 $('[data-toggle="tooltip"]').tooltip()
            })

        } else {
            snackBar('Failed to fetch todos', 'error');
        }
    };
}
fetchTodos();

function createTodo(arr) {

    let result = '';

    arr.forEach((p, i) => {

        result += `
            <tr id="${p.id}">
                <td>${i + 1}</td>
                <td
                data-toggle="tooltip"
                title="${p.title}">
                ${p.title}
                 </td>
                <td>${p.userId}</td>
                <td>
                    ${p.completed
                        ? '<span class="badge badge-success">Completed</span>'
                        : '<span class="badge badge-warning">Pending</span>'
                    }
                </td>
                <td>
                    <i class="fa-regular fa-pen-to-square fa-2x text-primary"
                     data-toggle="tooltip"
                    title="Edit Todo"
                    onclick="OnEdit(this)"></i>
                </td>
                <td>
                    <i class="fa-solid fa-trash fa-2x text-danger"
                     data-toggle="tooltip"
                    title="Remove Todo"
                    onclick="onRemove(this)"></i>
                </td>
            </tr>
        `;
    });

    todosContainer.innerHTML = result;
}

function onSubmitTodo(e) {

    e.preventDefault();

    spinner.classList.remove('d-none');

    let new_Todo = {
        title: titleControl.value,
        userId: userIdControl.value,
        completed: completedControl.value === 'true'
    };

    let xhr = new XMLHttpRequest();
    xhr.open('POST', POST_URL);
    xhr.setRequestHeader(
        'Content-Type',
        'application/json; charset=UTF-8'
    );

    xhr.send(JSON.stringify(new_Todo));

    xhr.onload = function () {

        spinner.classList.add('d-none');

        if (xhr.status >= 200 && xhr.status <= 299) {

            let res = JSON.parse(xhr.response);
            $(function () {
                     $('[data-toggle="tooltip"]').tooltip()
            })

            let tr = document.createElement('tr');
            tr.id = res.id;

            tr.innerHTML = `
                <td>${todosContainer.children.length + 1}</td>
                <td
                data-toggle="tooltip"
                title="${p.title}">
                ${p.title}
                 </td>
                <td>${new_Todo.userId}</td>
                <td>
                    ${new_Todo.completed
                        ? '<span class="badge badge-success">Completed</span>'
                        : '<span class="badge badge-warning">Pending</span>'
                    }
                </td>
                <td>
                    <i class="fa-regular fa-pen-to-square fa-2x text-primary" 
                    data-toggle="tooltip"
                    title="Edit Todo"
                    onclick="OnEdit(this)"></i>
                </td>
                <td>
                    <i class="fa-solid fa-trash fa-2x text-danger"
                    data-toggle="tooltip"
                    title="Remove Todo"
                    onclick="onRemove(this)"></i>
                </td>
            `;

            todosContainer.prepend(tr);

            let allRows = todosContainer.querySelectorAll('tr');

            allRows.forEach((row, index) => {
                row.children[0].textContent = index + 1;
            });

            todoForm.reset();

            snackBar(`New Todo ${new_Todo.userId} Created...`, 'success');

        } else {
            snackBar('Failed to create todo', 'error');
        }
    };
}

function onRemove(ele) {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {

        if (result.isConfirmed) {

            spinner.classList.remove('d-none');

            let REMOVE_ID = ele.closest('tr').id;
            let REMOVE_URL = `${POST_URL}/${REMOVE_ID}`;

            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', REMOVE_URL);
            xhr.send(null);

            xhr.onload = function () {

                spinner.classList.add('d-none');

                if (xhr.status >= 200 && xhr.status <= 299) {

                    document.getElementById(REMOVE_ID).remove();

                    let allRows = todosContainer.querySelectorAll('tr');

                    allRows.forEach((row, index) => {
                        row.children[0].textContent = index + 1;
                    });

                    snackBar(`Todo ${REMOVE_ID} Deleted...`, 'success');

                } else {
                    snackBar('Failed to remove todo', 'error');
                }
            };
        }
    });
}

function OnEdit(ele) {

    spinner.classList.remove('d-none');

    let Edit_ID = ele.closest('tr').id;

    localStorage.setItem('Edit_ID', Edit_ID);

    let Edit_URL = `${POST_URL}/${Edit_ID}`;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', Edit_URL);
    xhr.send(null);

    xhr.onload = function () {

        spinner.classList.add('d-none');

        if (xhr.status >= 200 && xhr.status <= 299) {

            let res = JSON.parse(xhr.response);

            titleControl.value = res.title;
            userIdControl.value = res.userId;
            completedControl.value = res.completed;

            addTodoBtn.classList.add('d-none');
            updateTodoBtn.classList.remove('d-none');


            todoForm.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        } else {
            snackBar('Failed to fetch todo', 'error');
        }
    };
}

function onUpdateTodo() {

    spinner.classList.remove('d-none');

    let UPDATED_ID = localStorage.getItem('Edit_ID');
    let UPDATED_URL = `${POST_URL}/${UPDATED_ID}`;

    let updated_obj = {
        title: titleControl.value,
        userId: userIdControl.value,
        completed: completedControl.value === 'true'
    };

    let xhr = new XMLHttpRequest();

    xhr.open('PATCH', UPDATED_URL);

    xhr.setRequestHeader(
        'Content-Type',
        'application/json; charset=UTF-8'
    );

    xhr.send(JSON.stringify(updated_obj));

    xhr.onload = function () {

        spinner.classList.add('d-none');

        if (xhr.status >= 200 && xhr.status <= 299) {

            let tr = document.getElementById(UPDATED_ID).children;

            tr[1].innerText = updated_obj.title;
            tr[2].innerText = updated_obj.userId;

            tr[3].innerHTML = updated_obj.completed
                ? '<span class="badge badge-success">Completed</span>'
                : '<span class="badge badge-warning">Pending</span>';

            todoForm.reset();

            addTodoBtn.classList.remove('d-none');
            updateTodoBtn.classList.add('d-none');


            let updatedRow = document.getElementById(UPDATED_ID);

            updatedRow.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            updatedRow.classList.add('highlight-row');
                        
            setTimeout(() => {
                updatedRow.classList.remove('highlight-row');
            }, 2000);
            snackBar(`Todo ${UPDATED_ID} Updated Successfully...`, 'success');

        } else {
            snackBar('Failed to update todo', 'error');
        }
    };
}

todoForm.addEventListener('submit', onSubmitTodo);
updateTodoBtn.addEventListener('click', onUpdateTodo);