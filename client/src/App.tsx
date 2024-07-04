import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

const types = {
  TEXT: "text",
  IMAGE: "image",
};

// Draggable Text Component
const DraggableText = ({ text, index, moveComponent }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: types.TEXT,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: types.TEXT,
    hover(item: any) {
      if (item.index !== index) {
        moveComponent(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        marginBottom: "10px",
        backgroundColor: "lightblue",
        padding: "10px",
      }}
    >
      {text}
    </div>
  );
};

// Draggable Image Component
const DraggableImage = ({ src, index, moveComponent }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: types.IMAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: types.IMAGE,
    hover(item: any) {
      if (item.index !== index) {
        moveComponent(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        marginBottom: "10px",
        maxWidth: "100%",
        maxHeight: "200px",
      }}
    >
      <img
        src={src}
        alt="Draggable"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  );
};

// Main App Component
const App = () => {
  const [designData, setDesignData] = useState({
    canvas: {
      components: [
        { type: types.TEXT, text: "Initial Text Component" }, // Initial text component
      ],
    },
  });
  const [designId, setDesignId] = useState("");

  // Function to move component within canvas
  const moveComponent = (dragIndex: any, hoverIndex: any) => {
    const draggedComponent = designData.canvas.components[dragIndex];
    const updatedComponents = [...designData.canvas.components];
    updatedComponents.splice(dragIndex, 1);
    updatedComponents.splice(hoverIndex, 0, draggedComponent);

      setDesignData({
      ...designData,
      canvas: {
        ...designData.canvas,
        components: [],
      },
    });
  };

  // Save design to backend
  const saveDesign = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/design/save", designData);
      setDesignId(response.data.designId);
      console.log("Design saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving design:", error);
    }
  };

  // Rendered components on canvas
  const renderComponents = () => {
    return designData.canvas.components.map((component: any, index) => {
      if (component.type === types.TEXT) {
        return (
          <DraggableText
            key={index}
            index={index}
            text={component.text}
            moveComponent={moveComponent}
          />
        );
      } else if (component.type === types.IMAGE) {
        return (
          <DraggableImage
            key={index}
            index={index}
            src={component.src}
            moveComponent={moveComponent}
          />
        );
      }
      return null;
    });
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Page Designer</h1>
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Draggable Components</h2>
          <DraggableText
            text="Sample Text 1"
            index={0}
            moveComponent={moveComponent}
          />
          <DraggableText
            text="Sample Text 2"
            index={1}
            moveComponent={moveComponent}
          />
          <DraggableImage
            src="https://via.placeholder.com/150"
            index={2}
            moveComponent={moveComponent}
          />
        </div>
        <div
          style={{
            border: "1px solid #ccc",
            marginTop: "20px",
            padding: "10px",
          }}
        >
          <h2>Design Canvas</h2>
          <div
            style={{
              width: "800px",
              height: "400px",
              border: "1px solid #ccc",
              position: "relative",
            }}
          >
            {renderComponents()}
          </div>
        </div>
      </DndProvider>
      <button onClick={saveDesign} style={{ marginTop: "20px" }}>
        Save Design
      </button>
      {designId && (
        <div style={{ marginTop: "20px" }}>
          <a
            href={`/designs/${designId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Designed Page
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
