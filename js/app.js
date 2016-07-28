console.log('app.js');
document.addEventListener("DOMContentLoaded", function (event) {
    app.init();
});

function User(id, username, first, last, country) {
    this.id = id;
    this.username = username;
    this.first_name = first;
    this.last_name = last;
    this.country = country;
}

app = {};

app.users = [];
app.selectedUser = null;
app.apiEndpoint = 'http://apitest.cohortdigital.com.au/users';
//app.apiEndpoint = 'api/users';
app.apiToken = 'testing-1-2-3';
app.tableElement = null;

app.init = function () {
    console.log('app.init');
    this.tableElement = document.querySelector('table#users');

    // .btn__edit opens #editModal
    // .btn__delete opens #deleteModal
    this.tableElement.addEventListener('click', function (event) {
        if ((event.target.className != 'btn__edit') && (event.target.className != 'btn__delete')) {
            return;
        }

        var id = event.target.parentNode.parentNode.getAttribute('data-id');
        for (var i = 0; i < app.users.length; i++) {
            if (app.users[i].id == id) {
                console.log(app.users[i]);
                app.selectedUser = app.users[i];
                break;
            }
        }

        switch (event.target.className) {
            case 'btn__edit':
                event.preventDefault();
                event.stopPropagation();
                app.showEdit();

                break;
            case 'btn__delete':
                event.preventDefault();
                event.stopPropagation();
                app.showDelete();
                break;
        }
    });

    // .btn__create opens #createModal
    document.querySelector('.btn__create').addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        app.showCreate();
    });

    // .modal__close closes #createModal and #editModal
    var closeBtns = document.querySelectorAll('.modal__close');
    for (var i = 0; i < closeBtns.length; i++) {
        closeBtns[i].addEventListener('click', function (event) {
            console.log('.modal__close clicked');
            app.closeModals();
        });
    }
    document.onkeydown = function (evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = evt.key == "Escape";
        } else {
            isEscape = evt.keyCode == 27;
        }
        if (isEscape) {
            app.closeModals();
        }
    };

    // #createModal form submit submits create user API request
    document.querySelector('#createModal form').addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Perform validation
        var user = new User(
            null,
            document.querySelector('#createUsername').value,
            document.querySelector('#createFirst').value,
            document.querySelector('#createLast').value,
            document.querySelector('#createCountry').value
        );

        if (!app.userIsValid(user)) {
            return false;
        }

        app.userCreate(user);
    })

    // #editModal form submit submits create user API request
    document.querySelector('#editModal form').addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Perform validation
        var user = new User(
            document.querySelector('#editId').value,
            document.querySelector('#editUsername').value,
            document.querySelector('#editFirst').value,
            document.querySelector('#editLast').value,
            document.querySelector('#editCountry').value
        );

        if (!app.userIsValid(user)) {
            return false;
        }

        app.userEdit(user);
    })

    // #deleteModal form submit submits create user API request
    document.querySelector('#deleteModal form').addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        app.userDelete(document.querySelector('#deleteId').value);
    })

    this.renderLoading();
    this.usersRefresh();
}

app.userIsValid = function (user) {
    if (!user.username) {
        alert("Invalid Username")
        return false;
    }
    if (!user.first_name) {
        alert("Invalid First Name");
        return false;
    }
    if (!user.last_name) {
        alert("Invalid Last Name");
        return false;
    }
    if (!user.country) {
        alert("Invalid Country");
        return false;
    }
    return true;
}

app.showCreate = function () {
    document.querySelector('#createModal').className = 'modal modal--open';
    document.querySelector('#createUsername').focus();
}

app.showEdit = function () {
    document.querySelector('#editId').value = app.selectedUser.id;
    document.querySelector('#editUsername').value = app.selectedUser.username;
    document.querySelector('#editFirst').value = app.selectedUser.first_name;
    document.querySelector('#editLast').value = app.selectedUser.last_name;
    document.querySelector('#editCountry').value = app.selectedUser.country;
    document.querySelector('#editModal').className = 'modal modal--open';
}

app.showDelete = function () {
    document.querySelector('#deleteId').value = app.selectedUser.id;
    document.querySelector('#deleteUsername').innerHTML = app.selectedUser.username;
    document.querySelector('#deleteModal').className = 'modal modal--open';
}

app.closeModals = function () {
    var modals = document.querySelectorAll('.modal--open');
    for (var i = 0; i < modals.length; i++) {
        modals[i].className = 'modal';
    }
}

app.request = function (type, endpoint, data, callbackSuccess, callbackFailure) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, endpoint);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('apiToken', this.apiToken);
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function () {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                callbackSuccess(xhr);
            } else {
                callbackFailure(xhr);
            }
        }
    }
}

app.usersRefresh = function () {
    console.log('app.usersRefresh');
    this.tableElement.className = 'users__loading';
    this.request(
        'GET',
        this.apiEndpoint,
        null,
        function (xhr) {
            console.log('success');
            var data = JSON.parse(xhr.response);
            if (data.success) {
                app.users = data.users ? data.users : data.userList;
            }
            app.render();

        }, function (xhr) {
            console.log('failure');
            app.renderError();
        }
    )
}

app.userCreate = function (user) {
    console.log('app.userCreate');
    document.querySelector('#createModal .btn__submit').setAttribute('disabled', 'disabled');
    this.request(
        'POST',
        this.apiEndpoint,
        user,
        function (xhr) {
            // Hide modal
            document.querySelector('#createModal').className = 'modal';
            // Clear form fields
            document.querySelector('#createModal form').reset();
            // Re-enable form submission
            document.querySelector('#createModal .btn__submit').removeAttribute('disabled');
            // Refresh all users
            app.usersRefresh();
        }, function (xhr) {
            // Re-enable form submission
            document.querySelector('#createModal .btn__submit').removeAttribute('disabled');
            // Display error alert
            alert('user creation failed');
        }
    )
}

app.userEdit = function (user) {
    console.log('app.userEdit');
    document.querySelector('#editModal .btn__submit').setAttribute('disabled', 'disabled');
    this.request(
        'PUT',
        this.apiEndpoint + '/' + user.id,
        user,
        function (xhr) {
            // Hide modal
            document.querySelector('#editModal').className = 'modal';
            // Clear form fields
            document.querySelector('#editModal form').reset();
            // Re-enable form submission
            document.querySelector('#editModal .btn__submit').removeAttribute('disabled');
            // Refresh all users
            app.usersRefresh();
        }, function (xhr) {
            // Re-enable form submission
            document.querySelector('#editModal .btn__submit').removeAttribute('disabled');
            // Display error alert
            alert('user edit failed');
        }
    )
}

app.userDelete = function (userId) {
    console.log('app.userDelete');
    document.querySelector('#deleteModal .btn__submit').setAttribute('disabled', 'disabled');
    this.request(
        'DELETE',
        this.apiEndpoint + '/' + userId,
        null,
        function (xhr) {
            // Hide modal
            document.querySelector('#deleteModal').className = 'modal';
            // Re-enable form submission
            document.querySelector('#deleteModal .btn__submit').removeAttribute('disabled');
            // Refresh all users
            app.usersRefresh();
        }, function (xhr) {
            // Re-enable form submission
            document.querySelector('#deleteModal .btn__submit').removeAttribute('disabled');
            // Display error alert
            alert('user deletion failed');
        }
    );
}

app.renderLoading = function () {
    app.tableElement.innerHTML = '<tr><th>Loading&hellip;</th></tr>';
}

app.renderError = function () {
    app.tableElement.innerHTML = '<tr><th>An error has occurred.</th></tr>';
}

app.render = function () {
    console.log('app.render');

    if (this.users.length > 0) {
        var newTable = '<tr><th>User ID</th><th>User Name</th><th>First</th><th>Last</th><th>Country</th><th>Actions</th></tr>';

        var i = 0, l = this.users.length, user = null;
        for (; i < l; i++) {
            user = this.users[i];
            newTable += '<tr data-id="' + user.id + '">' +
                '<td>' + user.id + '</td>' +
                '<td>' + user.username + '</td>' +
                '<td>' + user.first_name + '</td>' +
                '<td>' + user.last_name + '</td>' +
                '<td>' + user.country + '</td>' +
                '<td><a class="btn__edit" href="#edit">Edit</a> <a class="btn__delete" href="#delete">Delete</a></td></tr>';
        }
        app.tableElement.innerHTML = newTable;
    } else {
        app.tableElement.innerHTML = '<tr><th>There are no users, create the first one.</th></tr>';
    }

    app.tableElement.className = "users";
}