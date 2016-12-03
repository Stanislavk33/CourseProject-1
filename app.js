/* globals require  */

const config = require('./server/config/'),
    app = require('./server/config/application'),
    data = require('./server/data')(config),
    passport = require('passport'),
    controllers = require('./server/controllers')({  data, passport }),

    multer = require('multer'),
    uploadUserImage = multer({ dest: './public/imgs/user-images/' }),
    uploadCompetitionImage = multer({ dest: './public/imgs/competition-images/' }),
    uploadCategoryImage = multer({ dest: './public/imgs/categories-images/' });

require('./server/config/passport')(app, data);
require('./server/routers')({ app, data, controllers, uploadUserImage, uploadCompetitionImage, uploadCategoryImage });

app.listen(config.port);

console.log(`Server is running on port: ${config.port}`);
