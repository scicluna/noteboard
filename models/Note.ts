import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board'
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    top: {
        type: Number
    },
    left: {
        type: Number
    }
},
    {
        timestamps: true
    }
);

const Note = models.Note || model("Note", NoteSchema);
export default Note