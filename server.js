require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: "50mb"}));
app.use(cors());

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
//     });

// app.use(function(req, res, next) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     next()
//   });
  
// api routes
app.use('/api/users', require('./users/users.controller'));
app.use('/api/aircrafts', require('./aircrafts/aircrafts.controller'));
app.use('/api/manufacturers', require('./manufacturers/manufacturers.controller'));
app.use('/api/media', require('./model_media/model_media.controller'));
app.use('/api/scales', require('./model_scales/model_scales.controller'));
app.use('/api/groups', require('./aircraft_groups/aircraft_groups.controller'));
app.use('/api/aircraftmodels', require('./aircraftmodels/aircraftmodels.controller'));
app.use('/api/search', require('./searchAircraft/search.controller'));
app.use('/api/aircraftdetails', require('./aircraftdetails/aircraftdetails.controller'));
app.use('/api/aircraftimages', require('./aircraft_images/aircraft_images.controller'));
app.use('/api/brandimages', require('./brandimages/brand_images.controller'));
app.use('/api/sponsors', require('./sponsors/sponsors.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listening on port ' + port));