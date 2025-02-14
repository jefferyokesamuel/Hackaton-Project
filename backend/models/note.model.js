import mongoose from "mongoose"

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
   // On-chain fields
   fileId: { 
    type: String, required: false 
  },
   agentPrivateKey: { 
    type: String, required: false 
  },
   namespace: { 
    type: String, required: false
  },
   chain: { 
    type: String, required: true 
  },
})

const Note = mongoose.model("Note", noteSchema)

export default Note
