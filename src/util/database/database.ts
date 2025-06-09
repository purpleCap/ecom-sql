import { Sequelize } from "sequelize";

const sequelize = new Sequelize("ecommerce", "root", "toor", {
  dialect: "mysql",
  host: "localhost",
});

export default sequelize;