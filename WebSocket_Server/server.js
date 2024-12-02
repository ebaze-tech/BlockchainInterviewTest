const WebSocket = require("ws");
const db = require("./db");

// Create a WebSocket Server
const WebSocketServer = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server started on ws://localhost:8080");

// Setup for Event Listener Types
const EVENT_LISTENER_TYPES = [
  "FirstEvent",
  "SecondEvent",
  "ThirdEvent",
  "FourthEvent",
  "FifthEvent",
];

// Initiate and handle Client Side Connection
WebSocketServer.on("connection", (WebServer) => {
  console.log("Client side has been connected successfully.");

  WebServer.on("message", async (message) => {
    try {
      const data = JSON.parse(message); //This parses the incoming message from the server as a JavaScript Notation Object

      // Validate event type
      if (!EVENT_LISTENER_TYPES.includes(data.event)) {
        WebServer.send(
          JSON.stringify({ status: "Error", message: "Invalid event type." })
        );
        return;
      }
      // Check the format of the data (that is, the payload)
      if (!data.payload || typeof data.payload !== "object") {
        WebServer.send(
          JSON.stringify({
            status: "Error",
            message: "Invalid payload format.",
          })
        );
        return;
      }

      // Processing of the event
      await handleEvent(data);
      WebServer.send(
        JSON.stringify({ status: "Success", message: "Event processed" })
      );
    } catch (error) {
      console.error("Error handling message:", error);
      WebServer.send(
        JSON.stringify({ status: "Error", message: "Internal server error" })
      );
    }
  });
  WebServer.on("close", () => {
    console.log("Client disconnected");
  });
});

// Event Handler Function
async function handleEvent(data) {
  const { event, payload } = data;

  try {
    const result = await db.query(
      'INSERT INTO events (event_type, event_data) VALUES ($1, $2) RETURNING id',
      [event, JSON.stringify(payload)]
    );
    console.log('Event saved with ID:', result.rows[0].id);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
