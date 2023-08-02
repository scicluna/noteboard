import { Schema, model, models } from "mongoose";

const BoardSchema = new Schema({
    ownerid: {
        type: String
    },
    name: {
        type: String
    }
},
    {
        timestamps: true
    }
);

const Board = models.Board || model("Board", BoardSchema);
export default Board