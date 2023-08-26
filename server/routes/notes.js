import express from 'express'
const router = express.Router()
import {deleteNote, getNotes,postNotes,updateNote} from "../controllers/notes.js"
import { verifyAccessToken } from '../middlewares/index.js'

router.get('/',verifyAccessToken, getNotes)
router.post("/",verifyAccessToken, postNotes)
router.put("/:noteId",verifyAccessToken, updateNote)
router.delete("/:noteId",verifyAccessToken, deleteNote)

export default router;