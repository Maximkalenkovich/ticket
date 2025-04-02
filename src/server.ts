import app from "./app";
import sequelize from "./config/db";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connection to database established successfully.");

    await sequelize.sync({ force: true });
    console.log("Database synced");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
