import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
    boardid: {
        type: String
    },
    tempid: {
        type: String
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    width: {
        type: String
    },
    height: {
        type: String
    },
    top: {
        type: String
    },
    left: {
        type: String
    }
},
    {
        timestamps: true
    }
);

const Note = models.Note || model("Note", NoteSchema);
export default Note