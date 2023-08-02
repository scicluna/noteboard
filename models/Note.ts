import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
    boardid: {
        type: String
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