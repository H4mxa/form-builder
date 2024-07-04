const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const path = require("path");
const cors = require("cors");
const fs = require('fs').promises; // Using fs.promises for async file read

const app = express();
const port = 3001;

app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (designed pages)
app.use("/designs", express.static(path.join(__dirname, "public")));

// API endpoint to save design data
app.post("/api/design/save", async (req, res) => {
  const designData = req.body;

  try {
    const result = await db.saveDesign(designData);
    res
      .status(200)
      .json({
        message: "Design saved successfully",
        designId: result.insertId,
      });
  } catch (error) {
    console.error("Error saving design:", error);
    res.status(500).json({ error: "Failed to save design" });
  }
});

// API endpoint to retrieve designed page content
app.get("/api/design/:designId", async (req, res) => {
  const designId = req.params.designId;

  const mockedDesignData = {
    id: 1,
    canvas: {
      components: [
        {
          type: "text",
          content: "Hello, World!",
          position: { x: 100, y: 100 },
          // Add other properties as needed
        },
        // Add more components as needed
      ],
    },
    created_at: "2024-07-01T13:21:33.000Z",
  };

  try {
    const sada = await db.getDesignById(designId);

    console.log("sada: ", sada.canvas);
    const designData = mockedDesignData;
    if (!designData) {
      return res.status(404).json({ error: "Design not found" });
    }
   let html = await fs.readFile(
     path.join(__dirname, "public", "index.html"),
     "utf8"
   );

   // Inject dynamic data into the HTML template
   // Example: Replace placeholders in the HTML with actual data
   html = html.replace(
     "<!-- dynamicContent -->",
     `<h1>Design ID: ${designData.id}</h1>
       <p>Created at: ${designData.created_at}</p>
       <div id="canvas">
         ${renderComponents(designData.canvas.components)}
       </div>`
     // Add more fields as needed
   );

    // Serve the designed page template
    // res.sendFile(path.join(__dirname, "public", "index.html"));
     res.send(html);
  } catch (error) {
    console.error("Error retrieving design:", error);
    res.status(500).json({ error: "Failed to retrieve design" });
  }
});

function renderComponents(components) {
  return components
    .map((component) => {
      if (component.type === "text") {
        return `<div style="position: absolute; left: ${component.position.x}px; top: ${component.position.y}px;">
                <span>${component.content}</span>
              </div>`;
      }
      return ""; 
    })
    .join("");
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
