//sync or create database tables

const { sequelize } = require('./models');
sequelize.sync({ force: true });
//

//core imports
require('dotenv').config(); // for security
const express = require('express'); //for API
const cors = require('cors'); // for cross-domain-ports requests
const morgan = require('morgan'); // for dev-using logs

//routes import
const authRoute = require('./routes/authRoute');

//middlewares import
const notFound = require('./middlewares/notFound');
const error = require('./middlewares/error');

//cores
const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //logs option dev or combined
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/auth', authRoute);

//middlewares
app.use(notFound);
app.use(error);

//server runner
app.listen(process.env.PORT, () => {
  console.log(`app server listening on port ${process.env.PORT}`);
});
