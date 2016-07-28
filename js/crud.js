/*

// crud.js library

// 2016-07-29
// Philip Boardman
// https://github.com/dustykeyboard/crud.js

*/

function Crud(apiEndpoint, apiToken) {
    this.apiEndpoint = apiEndpoint;
    this.apiToken = apiToken;

    this.request = function (type, param, data, onSuccess, onFailure) {
        var xhr = new XMLHttpRequest();
        xhr.open(type, this.apiEndpoint + param);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.setRequestHeader('apiToken', this.apiToken);
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            var DONE = 4;
            var OK = 200;
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {
                    var json = JSON.parse(xhr.response);
                    onSuccess(json);
                } else {
                    onFailure();
                }
            }
        }
    }

    /*
    Cred.create(param, data, onSuccess, onFailure)
    param = string to append to apiEndpoint ('users')
    data = new object data
    onSuccess = success callback function with json param
    onFailure = failure callback function
    */
    this.create = function (param, data, onSuccess, onFailure) {
        this.request(
            'POST',
            param,
            data,
            onSuccess,
            onFailure
        )
    };

    /*
    Crud.read(param, onSuccess, onFailure)
    param = string to append to apiEndpoint ('users')
    onSuccess = success callback function with json param
    onFailure = failure callback function
    */
    this.read = function (param, onSuccess, onFailure) {
        this.request(
            'GET',
            param,
            null,
            onSuccess,
            onFailure
        );
    }

    /*
    Cred.update(param, data, onSuccess, onFailure)
    param = string to append to apiEndpoint ('users/1')
    data = new object data
    onSuccess = success callback function with json param
    onFailure = failure callback function
    */
    this.update = function (param, data, onSuccess, onFailure) {
        this.request(
            'PUT',
            param,
            data,
            onSuccess,
            onFailure
        )
    };

    /*
    Crud.delete(param, onSuccess, onFailure)
    param = string to append to apiEndpoint ('users')
    onSuccess = success callback function with json param
    onFailure = failure callback function
    */
    this.delete = function (param, onSuccess, onFailure) {
        this.request(
            'DELETE',
            param,
            null,
            onSuccess,
            onFailure
        );
    }

}