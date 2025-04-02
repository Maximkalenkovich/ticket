import { Request, Response, NextFunction } from "express";
import Ticket from "../models/Ticket";
import { Op } from "sequelize";

// Интерфейс для тела запроса
interface TicketRequestBody {
  topic: string;
  description: string;
  solution?: string;
  reason?: string;
}

export const createTicket = async (
  req: Request<{}, {}, TicketRequestBody>, // Пустые параметры пути, тело с данными
  res: Response,
  next: NextFunction // Добавляем NextFunction на случай, если нужно передать ошибку
): Promise<void> => {
  try {
    const { topic, description } = req.body;
    const ticket = await Ticket.create({ topic, description });
    res.status(201).json(ticket);
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ message: errorMessage });
  }
};

export const takeInWork = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }
    if (ticket.status !== "Новое") {
      res.status(400).json({ message: "Ticket is not new" });
      return;
    }

    ticket.status = "В работе";
    await ticket.save();

    res.json(ticket);
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ message: errorMessage });
  }
};

export const completeTicket = async (
  req: Request<{ id: string }, {}, TicketRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { solution } = req.body;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }
    if (ticket.status !== "В работе") {
      res.status(400).json({ message: "Ticket is not in work" });
      return;
    }
    ticket.status = "Завершено";
    ticket.solution = solution;
    await ticket.save();
    res.json(ticket);
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ message: errorMessage });
  }
};

export const cancelTicket = async (
  req: Request<{ id: string }, {}, { reason: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }
    if (ticket.status === "Завершено") {
      res.status(400).json({ message: "Ticket already completed" });
      return;
    }
    ticket.status = "Отменено";
    ticket.cancellationReason = reason;
    await ticket.save();
    res.json(ticket);
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ message: errorMessage });
  }
};

export const getTickets = async (
  req: Request<
    {},
    {},
    {},
    { date?: string; startDate?: string; endDate?: string }
  >, // Query параметры
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, startDate, endDate } = req.query;

    let whereClause: any = {};

    if (date) {
      whereClause.createdAt = new Date(date);
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const tickets = await Ticket.findAll({ where: whereClause });
    res.json(tickets);
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ message: errorMessage });
  }
};

export const cancelAllInWork = async (
  req: Request, // Без параметров и тела
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tickets = await Ticket.findAll({ where: { status: "В работе" } });
    for (const ticket of tickets) {
      ticket.status = "Отменено";
      ticket.cancellationReason = "Массовое отключение";
      await ticket.save();
    }
    res.json({ message: "All in-work tickets canceled" });
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ message: errorMessage });
  }
};
