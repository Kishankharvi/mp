const Cursor = ({ color, x, y, name }) => {
  if (x === undefined || y === undefined) return null

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        top: 0,
        left: 0,
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 0.1s linear",
      }}
    >
      <div
        style={{
          width: "2px",
          height: "20px",
          backgroundColor: color,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-20px",
          left: "2px",
          backgroundColor: color,
          color: "white",
          fontSize: "10px",
          padding: "2px 4px",
          borderRadius: "2px",
          whiteSpace: "nowrap",
          fontWeight: "bold",
        }}
      >
        {name}
      </div>
    </div>
  )
}

export default Cursor
