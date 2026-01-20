import { Router } from "express";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js"
import { validateProjectPermission } from "../middlewares/auth.middleware.js";
import { createNote, deleteNote, getNoteById, getNotes, updateNote } from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/projects/:projectId/notes")
    .get(
        verifyJWT,
        validateProjectPermission(AvailableUserRoles),
        getNotes)
    .post(
        verifyJWT,
        validateProjectPermission([UserRolesEnum]),
        createNote)

rouet.route("/projects/:projectId/notes/:noteId")
    .get(
        verifyJWT,
        validateProjectPermission(AvailableUserRoles),
        getNoteById)
    .put(
        verifyJWT,
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        updateNote)
    .delete(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        deleteNote);
        
export default router;