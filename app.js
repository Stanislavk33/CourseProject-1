/* globals require  */

const config = require('./server/config/'),

app = require('./server/config/application'),

data = require('./server/data')(config),

multer = require('multer'),
uploadUserImage = multer({ dest: './public/imgs/user-images/' }),
uploadCompetitionImage = multer({ dest: './public/imgs/competition-images/'});

require('./server/config/passport')(app, data);
require('./server/routers')({ app, data, uploadUserImage, uploadCompetitionImage });

app.listen(config.port);

console.log(`Server is running on port: ${config.port}`);
