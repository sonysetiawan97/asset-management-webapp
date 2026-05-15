import { serverError } from "./serverError";
import { unauthorized } from "./unauthorized";
import { slow } from "./slow";

export const handlers = [serverError, unauthorized, slow];