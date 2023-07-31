import { Schema, model, models } from "mongoose";

const BoardSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
},
    {
        timestamps: true
    }
);

const Board = models.Board || model("Board", BoardSchema);
export default Board