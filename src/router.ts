// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/celebrate`
  | `/group/:groupId/view`
  | `/home`
  | `/map`
  | `/project/:projectId/edit`
  | `/project/:projectId/join`
  | `/project/:projectId/survey`
  | `/project/:projectId/view`
  | `/project/new`
  | `/track`
  | `/user/:userId/view`;

export type Params = {
  "/group/:groupId/view": { groupId: string };
  "/project/:projectId/edit": { projectId: string };
  "/project/:projectId/join": { projectId: string };
  "/project/:projectId/survey": { projectId: string };
  "/project/:projectId/view": { projectId: string };
  "/user/:userId/view": { userId: string };
};

export type ModalPath =
  | `/add`
  | `/messages`
  | `/profile`
  | `/project/[projectId]/ask`
  | `/project/[projectId]/event`
  | `/search`;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
