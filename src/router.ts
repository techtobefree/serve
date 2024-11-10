// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/group/:groupId/view`
  | `/groups`
  | `/local`
  | `/messages`
  | `/project/:projectId/edit`
  | `/project/:projectId/join`
  | `/project/:projectId/view`
  | `/project/new`
  | `/projects`
  | `/user/:userId/view`;

export type Params = {
  "/group/:groupId/view": { groupId: string };
  "/project/:projectId/edit": { projectId: string };
  "/project/:projectId/join": { projectId: string };
  "/project/:projectId/view": { projectId: string };
  "/user/:userId/view": { userId: string };
};

export type ModalPath = `/add` | `/menu` | `/profile`;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
