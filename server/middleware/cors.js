/**
 * Configure CORS middleware
 */
const cors = require('cors');

let instance = process.env.NODE_ENV === 'production' ? cors({ origin: process.env.SERVER_ROOT }) : cors();

module.exports = instance;
