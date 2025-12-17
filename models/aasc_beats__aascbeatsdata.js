import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model(
  "aasc_beats__aascbeatsdata",
  schema,
  "aasc_beats__aascbeatsdata"
);
