import { z } from "zod";
import { dateSchema, idSchema, moneySchema, optionalText } from "./common";

export const BUDGET_CATEGORIES = [
  "cast",
  "crew",
  "camera",
  "lighting",
  "sound",
  "art",
  "locations",
  "travel",
  "accommodation",
  "catering",
  "equipment_rental",
  "post_production",
  "insurance_permissions",
  "contingency",
  "other",
] as const;

export const budgetLineItemSchema = z.object({
  id: idSchema("bli"),
  projectId: idSchema("prj"),
  category: z.enum(BUDGET_CATEGORIES),
  name: z.string().trim().min(1).max(160),
  vendorName: z.string().trim().max(160).optional(),
  plannedAmount: moneySchema,
  actualAmount: moneySchema,
  paidAmount: moneySchema,
  dueDate: dateSchema.optional(),
  paymentStatus: z.enum(["pending", "partially_paid", "paid"]),
  notes: optionalText,
});

export const expenseSchema = z.object({
  id: idSchema("exp"),
  projectId: idSchema("prj"),
  budgetLineItemId: idSchema("bli"),
  expenseDate: dateSchema,
  amount: moneySchema,
  payee: z.string().trim().min(1).max(160),
  description: optionalText,
  receiptUrl: z.string().optional(),
  createdBy: idSchema("usr"),
});
