const PresenceBar = ({ participants }) => {
  if (!participants || participants.length === 0) {
    return <div className="text-xs text-slate-500">No participants yet...</div>
  }

  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-bold text-xs text-slate-200">Participants ({participants.length})</h4>
      <div className="flex flex-wrap gap-2">
        {participants.map((p) => (
          <div
            key={p._id}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-full text-xs transition-colors"
            title={`${p.username} (${p.role})`}
          >
            <span className={`h-2 w-2 rounded-full ${p.role === "mentor" ? "bg-green-500" : "bg-blue-500"}`}></span>
            <span className="text-slate-200">{p.username}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PresenceBar
