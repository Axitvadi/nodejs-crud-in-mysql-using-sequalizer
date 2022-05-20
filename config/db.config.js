const mysql = require("mysql");
const {Sequelize,DataTypes} = require("sequelize");

//Sequelize connection
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
   host: process.env.HOST,
   port: 3306,
   dialect: 'mysql',
   pool: {
      max: 5,
      min: 0,
      acquire: process.env.POOL_ACQUIRE,
      idle: process.env.POOL_IDLE
  }
});

sequelize.authenticate().then(()=>{
      console.log(' Connection has been established successfully.');
   }).catch((err) =>{
      console.log(err);
   })

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.product = require("../model/product")(sequelize, DataTypes);
module.exports = db;