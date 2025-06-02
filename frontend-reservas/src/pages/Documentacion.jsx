function Documentacion() {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "250px", // Ajusta este valor al ancho real de tu sidebar
          right: 0,
          bottom: 0,
          width: "calc(100% - 250px)", // Resta el ancho del sidebar
          height: "100vh",
          backgroundColor: "#fff",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <iframe
          src="http://127.0.0.1:5500/documentacion/index.html"
          title="Documentacion"
          width="100%"
          height="100%"
          style={{
            border: "none"
          }}
        />
      </div>
    );
  }
  
  export default Documentacion;
  