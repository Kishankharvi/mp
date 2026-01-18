import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "Untitled Room" },

    // Owner
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },

    // Settings
    language: { type: String, default: "javascript" },
    maxUsers: { type: Number, default: 10 },

    // Files
    files: [{
      path: { type: String, required: true },
      content: { type: String, default: "" },
      language: { type: String }
    }],

    // Participants
    participants: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
      role: { type: String, enum: ['owner', 'mentor', 'participant'], default: 'participant' },
      canEdit: { type: Boolean, default: true },
      joinedAt: { type: Date, default: Date.now }
    }],

    // Session Reference (for mentoring)
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },

    // Permissions
    permissions: {
      allowChat: { type: Boolean, default: true },
      allowExecution: { type: Boolean, default: true },
      allowScreenShare: { type: Boolean, default: true }
    },

    // Recording
    recording: {
      enabled: { type: Boolean, default: false },
      url: { type: String },
      startedAt: { type: Date },
      duration: { type: Number } // in seconds
    },

    // Whiteboard
    whiteboard: {
      enabled: { type: Boolean, default: false },
      data: { type: mongoose.Schema.Types.Mixed } // Canvas drawing data
    },

    // Status
    status: { type: String, enum: ["active", "closed"], default: "active" }
  },
  {
    timestamps: true
  }
);

// Indexes

roomSchema.index({ createdBy: 1 });
roomSchema.index({ status: 1 });

// Method to toggle user edit permission
roomSchema.methods.toggleUserEdit = function (userId, canEdit) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (participant) {
    participant.canEdit = canEdit;
  }
  return this.save();
};

// Method to start recording
roomSchema.methods.startRecording = function () {
  this.recording.enabled = true;
  this.recording.startedAt = new Date();
  return this.save();
};

// Method to stop recording
roomSchema.methods.stopRecording = function (recordingUrl) {
  this.recording.enabled = false;
  if (this.recording.startedAt) {
    this.recording.duration = Math.floor((Date.now() - this.recording.startedAt) / 1000);
  }
  this.recording.url = recordingUrl;
  return this.save();
};

export default mongoose.model("Room", roomSchema);
