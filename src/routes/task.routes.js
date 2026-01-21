import { Router } from "express";
import {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask,
    createSubTask,
    getSubTasksByTask,
    toggleSubTaskStatus,
    deleteSubTask
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateProjectPermission } from "../middlewares/project.middleware.js";
import { AvailableUserRoles } from "../utils/constants.js";
import { get } from "mongoose";

const router = Router();

//TASK ROUTES
router
    .route("/projects/:projectId/tasks")
    .post(
        verifyJWT,
        validateProjectPermission( AvailableUserRoles ),
        createTask
    )
    .get(
        verifyJWT,
        validateProjectPermission(AvailableUserRoles),
        getTasksByProject
    );

router
    .route("/tasks/:taskId")
    .put(
        verifyJWT,
        updateTask
    )
    .delete(
        verifyJWT,
        deleteTask
    );

//SUBTASK ROUTE
router
    .route("/tasks/:taskId/subtasks")
    .post(
        verifyJWT,
        createSubTask
    )
    .get(
        verifyJWT,
        getSubTasksByTask
    );

router
    .route("/subtasks/:subTaskId")
    .patch(
        verifyJWT,
        toggleSubTaskStatus
    )
    .delete(
        verifyJWT,
        deleteSubTask
    );

export default router;