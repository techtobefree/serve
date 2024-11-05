// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/Groups`
  | `/Messages`
  | `/Projects`
  | `/group/:groupId/detail`
  | `/project/:projectId/detail`
  | `/user/:userId/detail`

export type Params = {
  '/group/:groupId/detail': { groupId: string }
  '/project/:projectId/detail': { projectId: string }
  '/user/:userId/detail': { userId: string }
}

export type ModalPath = `/menu` | `/profile`

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
