import express, { Application, Request, Response } from "express";
import ticketRoutes from "./routes/ticketRoutes";

const app: Application = express();

app.use(express.json());

app.use("/api/tickets", ticketRoutes);

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;
