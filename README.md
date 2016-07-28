# apitest
Vanilla Javascript interface with a JSON CRUD API

If API is hosted on a remote server, cross-origin issues will need to be resolved.

A simple PHP CRUD API is provided in the `/api` directory. Objects of a `type` can be created, read, updated and deleted. The objects are stored in a file named `type`.json.

Modals are used for Create, Edit and Delete interactions with a simple validation applied before sending data through to the API. When a modal is presented a shade is placed above the rest of the application to prevent interaction.

After changes are send to the API, the data table is refreshed. During the refresh, the data table, the content is dimmed and clicks are ignored to prevent users interacting with stale data.

## Crud.json

The CRUD methods have been refactored into a separate library. See [crud.js](https://github.com/dustykeyboard/crud.js) for usage.
