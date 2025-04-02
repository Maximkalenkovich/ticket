import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface TicketAttributes {
  id: number;
  topic: string;
  description: string;
  status: "Новое" | "В работе" | "Завершено" | "Отменено";
  solution?: string;
  cancellationReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TicketCreationAttributes
  extends Optional<
    TicketAttributes,
    | "id"
    | "status"
    | "solution"
    | "cancellationReason"
    | "createdAt"
    | "updatedAt"
  > {}

class Ticket extends Model<TicketAttributes, TicketCreationAttributes> {
  public id!: number;
  public topic!: string;
  public description!: string;
  public status!: "Новое" | "В работе" | "Завершено" | "Отменено";
  public solution?: string;
  public cancellationReason?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Новое", "В работе", "Завершено", "Отменено"),
      defaultValue: "Новое",
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "tickets",
    timestamps: true,
  }
);

export default Ticket;
