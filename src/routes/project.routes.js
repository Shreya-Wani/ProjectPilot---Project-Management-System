import { Router } from "express";
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMemberRole
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateProjectPermission } from "../middlewares/project.middleware.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js"

const router = Router();

router
    .route("/projects")
    .get(
        verifyJWT,
        getProjects
    )
    .post(
        verifyJWT,
        createProject
    );

router
    .route("/projects/:projectId")
    .get(
        verifyJWT,
        validateProjectPermission(AvailableUserRoles),
        getProjectById
    )
    .put(
        verifyJWT,
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        updateProject
    )
    .delete(
        verifyJWT,
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteProject
    );

router
    .route("/projects/:projectId/members")
    .post(
        verifyJWT,
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        addMemberToProject
    )
    .get(
        verifyJWT,
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        getProjectMembers
    );

router
    .route("/projects/members/:memberId")
    .put(
        verifyJWT,
        validateProjectPermission([UserRolesEnum.ADMIN]),
        updateMemberRole
    )
    .delete(
        verifyJWT,
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteMemberRole
    );

export default router;