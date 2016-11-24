/* globals require  */

const config = require("./server/config");

const app = require("./server/config/application");

const data = require("./server/data")(config);
require("./server/routers")(app, data);

app.listen(config.port, () => {
    console.log(`Running at ${config.port}`);
})