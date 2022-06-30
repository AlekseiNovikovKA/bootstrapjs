$(async function () {
    await getTableWithUsers();
    getDefaultModal();
    addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('http://localhost:8080/api/users'),
    findOneUser: async (id) => await fetch(`http://localhost:8080/api/users/${id}`),
    addNewUser: async (user) => await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`http://localhost:8080/api/users/${id}`, {

        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head
    })
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>  
                            <td>${user.email}</td>
                            <td>${user.shortRoles}</td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-primary btn-sm text-white text-decoration-none text-center btn-info" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-primary btn-sm text-white text-decoration-none text-center btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}


async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        openModal(thisModal, userid, action);
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function openModal(modal, id, action) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    const closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;

    let actionButton;
    switch (action) {
        case 'edit':
            modal.find('.modal-title').html('Edit user');
            actionButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
            break;
        case 'delete':
            modal.find('.modal-title').html('Delete User');
            actionButton = `<button class="btn btn-danger" id="deleteButton">Delete</button>`;
            break;
    }
    modal.find('.modal-footer').append(closeButton, actionButton);

    user.then(user => {
        let bodyForm = `
                                    <form id="editUserForm" class="form-signin mx-auto font-weight-bold text-center" style="width: 200px;">
                                                                        <div class="form-check">
                                                                            <label for="id"
                                                                                   class="form-label">ID</label>
                                                                            <input type="text"
                                                                                   class="form-control"
                                                                                   value="${user.id}"
                                                                                   id="id" name="id" readonly/>
                                                                            <label for="name" class="form-label">First
                                                                                name</label>
                                                                            <input type="text"
                                                                                   class="form-control"
                                                                                   id="name" name="name"
                                                                                   value="${user.name}"/>
                                                                            <label for="lastName" class="form-label">Last
                                                                                name</label>
                                                                            <input type="text"
                                                                                   class="form-control"
                                                                                   id="lastName" name="lastName"
                                                                                   value="${user.lastName}"/>
                                                                            <label for="age"
                                                                                   class="form-label">Age</label>
                                                                            <input type="number" min="0" max="127"
                                                                                   class="form-control"
                                                                                   id="age" name="age"
                                                                                   value="${user.age}"/>
                                                                            <label for="email"
                                                                                   class="form-label">Email</label>
                                                                            <input type="email"
                                                                                   class="form-control"
                                                                                   id="email" name="email"
                                                                                   value="${user.email}"/>
                                                                                   <div id="div-password">
                                                                            <label for="password"
                                                                                   class="form-label">Password</label>
                                                                            <input type="text"
                                                                                   class="form-control"
                                                                                   id="password" name="password" />  
                                                                                   </div>   
                                                                            <div>
                                                                                <label for="roles">Role</label>
                                                                                <select class="custom-select" size="2" id="roles"  multiple>
                                                                                    <option ${user.shortRoles.includes('USER') ? 'selected':''} value="1">ROLE_USER</option>
                                                                                    <option ${user.shortRoles.includes('ADMIN') ? 'selected':''} value="2">ROLE_ADMIN</option>
                                                                                </select>
                                                                              
                                                                            </div>
                                                                            </div>
                                                                    </form>
        `;
        modal.find('.modal-body').append(bodyForm);
        if (action === 'delete') {
            modal.find('input').attr('readonly', true);
            modal.find('select').attr('disabled', true);
            modal.find('#div-password').remove();
        }

    })

    $("#editButton").on('click', async () => {
        const myForm = document.getElementById("editUserForm");
        const formData = new FormData(myForm);
        const formDataObject = Object.fromEntries(formData.entries());
        formDataObject.roles = $('#editUserForm').find('#roles').val().map(([id]) => ({ id }));
        const response = await userFetchService.updateUser(formDataObject, formDataObject.id);
        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            const alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            Даннные введены некоректно
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })

    $("#deleteButton").on('click', async () => {
        await userFetchService.deleteUser(id);
        getTableWithUsers();
        modal.modal('hide');
    })
}

async function addNewUser() {
    $('#addNewUserButton').click(async () => {
        const myForm = document.getElementById("defaultSomeForm");
        const formData = new FormData(myForm);
        const formDataObject = Object.fromEntries(formData.entries());
        formDataObject.roles = $('#defaultSomeForm').find('#AddNewUserRoles').val().map(([id]) => ({ id }));;

        const response = await userFetchService.addNewUser(formDataObject);
        if (response.ok) {
            getTableWithUsers();
            $('#userlistTable').click();
            $('#defaultSomeForm')[0].reset();
            $('#sharaBaraMessageError').remove();
        } else {
            const alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            Даннные введены некоректно
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            $('#defaultSomeForm').prepend(alert)
        }
    })
}