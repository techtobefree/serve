// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/group/:groupId/detail`
  | `/groups`
  | `/messages`
  | `/project/:projectId/detail`
  | `/project/:projectId/edit`
  | `/project/:projectId/join`
  | `/projects`
  | `/user/:userId/detail`

export type Params = {
  '/group/:groupId/detail': { groupId: string }
  '/project/:projectId/detail': { projectId: string }
  '/project/:projectId/edit': { projectId: string }
  '/project/:projectId/join': { projectId: string }
  '/user/:userId/detail': { userId: string }
}

export type ModalPath = `/add` | `/menu` | `/profile`

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
