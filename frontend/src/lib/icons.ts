import {
  PiggyBank,
  ShoppingCart,
  Gift,
  Utensils,
  BriefcaseBusiness,
  CarFront,
  HeartPulse,
  ToolCase,
  PawPrint,
  House,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  ReceiptText,
} from "lucide-react";

export const iconMap = {
  "briefcase-business": BriefcaseBusiness,
  "car-front": CarFront,
  "heart-pulse": HeartPulse,
  "piggy-bank": PiggyBank,
  "shopping-cart": ShoppingCart,
  "tool-case": ToolCase,
  utensils: Utensils,
  "pawn-print": PawPrint,
  house: House,
  gift: Gift,
  dumbell: Dumbbell,
  "book-open": BookOpen,
  "baggage-claim": BaggageClaim,
  mailbox: Mailbox,
  "reciept-text": ReceiptText,
};

export type IconName = keyof typeof iconMap;
