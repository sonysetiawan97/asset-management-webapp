import { handlers as authHandlers } from "./auth/handlers";
import { handlers as errorHandlers } from "./errors/handlers";
import { handlers as productHandlers } from "./products/handlers";

export const handlers = [...authHandlers, ...errorHandlers, ...productHandlers];
