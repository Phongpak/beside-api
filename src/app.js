const express = require("express");
const { sequelize } = require("./models");
sequelize.sync();
