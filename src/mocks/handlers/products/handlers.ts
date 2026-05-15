import { findAll } from "./findAll";
import { create } from "./create";
import { findOne } from "./findOne";
import { update } from "./update";
import { softDelete } from './softDelete';

export const handlers = [update, findOne, findAll, create, softDelete];
