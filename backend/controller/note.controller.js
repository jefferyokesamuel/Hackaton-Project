import Note from "../models/note.model.js"
import { Agent } from "@fileverse/agents"
import 'dotenv/config'
import { errorHandler } from "../utils/error.js"

export const addNote = async (req, res, next) => {
  const { title, content, tags } = req.body;
  const { id: userId } = req.user;

  try {
    if (!title || !content) {
      throw errorHandler(400, "Title and content are required");
    }

    // Add validation for title format
    const sanitizedTitle = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!sanitizedTitle) {
      throw errorHandler(400, "Invalid title format");
    }

    // Verify environment variables are set
    if (!process.env.PINATA_JWT || !process.env.PIMLICO_API_KEY) {
      throw errorHandler(500, "Server configuration error");
    }

    const agent = new Agent({
      chain: process.env.CHAIN || 'sepolia',
      pinataJWT: process.env.PINATA_JWT,
      pinataGateway: process.env.PINATA_GATEWAY,
      pimlicoAPIKey: process.env.PIMLICO_API_KEY,
    });

    // Add error handling for SDK operations
    let file;
    try {
      await agent.setupStorage(title);
      file = await agent.create(content);
    } catch (sdkError) {
      console.error('Fileverse SDK Error:', sdkError);
      throw errorHandler(502, "Blockchain storage operation failed");
    }

    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId,
      fileId: file.fileId || '',
      chain: process.env.CHAIN,
    });

    await note.save();

    res.status(201).json({ 
      success: true,
      message: "Note added successfully",
      note: {
        ...note.toObject(),
        // Expose only necessary fields to frontend
        agentPrivateKey: undefined 
      }
    });

  } catch (error) {
    console.error('Add Note Error:', error);
    next(error);
  }
};

export const editNote = async (req, res, next) => {
  const note = await Note.findById(req.params.noteId)

  if (!note) {
    return next(errorHandler(404, "Note not found"))
  }

  if (req.user.id !== note.userId) {
    return next(errorHandler(401, "You can only update your own note!"))
  }

  const { title, content, tags, isPinned } = req.body

  if (!title && !content && !tags) {
    return next(errorHandler(404, "No changes provided"))
  }

  try {
    if (title) {
      note.title = title
    }

    if (content) {
      note.content = content
    }

    if (tags) {
      note.tags = tags
    }

    if (isPinned) {
      note.isPinned = isPinned
    }

    await note.save()

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllNotes = async (req, res, next) => {
  const userId = req.user.id

  try {
    const notes = await Note.find({ userId: userId }).sort({ isPinned: -1 })

    res.status(200).json({
      success: true,
      message: "All notes retrived successfully",
      notes,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId

  const note = await Note.findOne({ _id: noteId, userId: req.user.id })

  if (!note) {
    return next(errorHandler(404, "Note not found"))
  }

  try {
    await Note.deleteOne({ _id: noteId, userId: req.user.id })

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const updateNotePinned = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId)

    if (!note) {
      return next(errorHandler(404, "Note not found!"))
    }

    if (req.user.id !== note.userId) {
      return next(errorHandler(401, "You can only update your own note!"))
    }

    const { isPinned } = req.body

    note.isPinned = isPinned

    await note.save()

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    })
  } catch (error) {
    next(error)
  }
}

export const searchNote = async (req, res, next) => {
  const { query } = req.query

  if (!query) {
    return next(errorHandler(400, "Search query is required"))
  }

  try {
    const matchingNotes = await Note.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    })

    res.status(200).json({
      success: true,
      message: "Notes matching the search query retrieved successfully",
      notes: matchingNotes,
    })
  } catch (error) {
    next(error)
  }
}
