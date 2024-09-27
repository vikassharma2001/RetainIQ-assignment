import React, { useState } from "react";
import "./App.css"; // Create this file for custom styles if needed
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";

const initialStates = ["California", "New York", "Texas"];
const initialVariants = ["Variant 1", "Variant 2", "Variant 3", "Variant 4"];
const initialImagePaths = [
  ["logo.jpg", "logo.jpg", "logo.jpg", "logo.jpg"],
  ["logo.jpg","logo.jpg", null, "logo.jpg"],
  ["logo.jpg", "logo.jpg", "logo.jpg","logo.jpg"],
];

const images = [
  { src: "https://placehold.co/150x150?text=Design+1", alt: "Design 1" },
  { src: "https://placehold.co/150x150?text=Design+2", alt: "Design 2" },
  { src: "https://placehold.co/150x150?text=Design+3", alt: "Design 3" },
  { src: "https://placehold.co/150x150?text=Design+4", alt: "Design 4" },
  { src: "https://placehold.co/150x150?text=Design+5", alt: "Design 5" },
  { src: "https://placehold.co/150x150?text=Design+6", alt: "Design 6" },
];

function App() {
  return (
    <div className="container-fluid mt-4">
      <Header />
      <VariantTable />
    </div>
  );
}

function Header() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img src="logo.jpg" alt="Logo" className="mb-4 logo" />
      <h1 className="mb-4 ms-3">Product Variant Table</h1>
    </div>
  );
}

function VariantTable() {
  const [states, setStates] = useState(initialStates);
  const [variants, setVariants] = useState(initialVariants);
  const [tags, setTags] = useState(initialStates.map(() => []));
  const [imageMatrix, setImageMatrix] = useState(
    initialImagePaths
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCell, setCurrentCell] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle adding a new state
  const addState = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const newState = `State ${states.length + 1}`;
        setStates([...states, newState]);
        setTags([...tags, []]);
        setImageMatrix([...imageMatrix, Array(variants.length).fill(null)]);
        setLoading(false);
      } catch (err) {
        setError("Failed to add state. Please try again.");
        setLoading(false);
      }
    }, 500);
  };

  // Handle deleting a state
  const deleteState = (index) => {
    setLoading(true);
    setTimeout(() => {
      try {
        const newStates = [...states];
        const newTags = [...tags];
        const newImageMatrix = [...imageMatrix];
        newStates.splice(index, 1);
        newTags.splice(index, 1);
        newImageMatrix.splice(index, 1);
        setStates(newStates);
        setTags(newTags);
        setImageMatrix(newImageMatrix);
        setLoading(false);
      } catch (err) {
        setError("Failed to delete state. Please try again.");
        setLoading(false);
      }
    }, 500);
  };

  // Handle adding a new variant
  const addVariant = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const newVariant = `Variant ${variants.length + 1}`;
        setVariants([...variants, newVariant]);
        const newImageMatrix = imageMatrix.map((row) => [...row, null]);
        setImageMatrix(newImageMatrix);
        setLoading(false);
      } catch (err) {
        setError("Failed to add variant. Please try again.");
        setLoading(false);
      }
    }, 500);
  };

  // Handle deleting a variant
  const deleteVariant = (index) => {
    setLoading(true);
    setTimeout(() => {
      try {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        const newImageMatrix = imageMatrix.map((row) => {
          const newRow = [...row];
          newRow.splice(index, 1);
          return newRow;
        });
        setVariants(newVariants);
        setImageMatrix(newImageMatrix);
        setLoading(false);
      } catch (err) {
        setError("Failed to delete variant. Please try again.");
        setLoading(false);
      }
    }, 500);
  };

  // Handle drag and drop
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const newStates = [...states];
        const newTags = [...tags];
        const newImageMatrix = [...imageMatrix];

        // Swap states
        const [movedState] = newStates.splice(draggedIndex, 1);
        newStates.splice(index, 0, movedState);

        // Swap tags
        const [movedTags] = newTags.splice(draggedIndex, 1);
        newTags.splice(index, 0, movedTags);

        // Swap image matrix
        const [movedImages] = newImageMatrix.splice(draggedIndex, 1);
        newImageMatrix.splice(index, 0, movedImages);

        setStates(newStates);
        setTags(newTags);
        setImageMatrix(newImageMatrix);
        setDraggedIndex(null);
        setLoading(false);
      } catch (err) {
        setError("Failed to reorder states. Please try again.");
        setLoading(false);
      }
    }, 500);
  };

  // Handle adding a tag
  const addTag = (stateIndex) => {
    const tagName = prompt("Enter tag name:");
    if (tagName) {
      const newTags = [...tags];
      newTags[stateIndex].push(tagName);
      setTags(newTags);
    }
  };

  // Handle editing a tag
  const editTag = (stateIndex, tagIndex) => {
    const newTagName = prompt("Edit tag name:", tags[stateIndex][tagIndex]);
    if (newTagName) {
      const newTags = [...tags];
      newTags[stateIndex][tagIndex] = newTagName;
      setTags(newTags);
    }
  };

  // Handle deleting a tag
  const deleteTag = (stateIndex, tagIndex) => {
    const newTags = [...tags];
    newTags[stateIndex].splice(tagIndex, 1);
    setTags(newTags);
  };

  // Handle opening the image modal
  const openImageModal = (stateIndex, variantIndex) => {
    setCurrentCell({ stateIndex, variantIndex });
    setShowModal(true);
  };

  // Handle inserting an image
  const insertImage = (image) => {
    if (currentCell) {
      const { stateIndex, variantIndex } = currentCell;
      const newImageMatrix = [...imageMatrix];
      newImageMatrix[stateIndex][variantIndex] = "logo.jpg";
      setImageMatrix(newImageMatrix);
      setShowModal(false);
    }
  };

  // Handle searching images
  const filteredImages = images.filter((image) =>
    image.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle deleting a state via the delete button in the table
  const handleDeleteState = (e, index) => {
    e.stopPropagation();
    deleteState(index);
  };

  // Handle deleting a variant via the delete button in the header
  const handleDeleteVariant = (e, index) => {
    e.stopPropagation();
    deleteVariant(index);
  };

  return (
    <>
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      <div className="table-wrapper">
        <table className="table table-bordered table-fixed-left">
          <thead>
            <tr>
              <th>Filter</th>
              {variants.map((variant, index) => (
                <th key={index}>
                  {variant}{" "}
                  <button
                    className="btn btn-sm btn-link text-danger"
                    onClick={(e) => handleDeleteVariant(e, index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </th>
              ))}
              <th>Add Variant</th>
                </tr>
              
          </thead>
          <tbody>
            {states.map((state, stateIndex) => (
              <tr
                key={stateIndex}
                draggable
                onDragStart={() => handleDragStart(stateIndex)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stateIndex)}
                className="draggable"
              >
                <td>
                  <div className="d-flex align-items-center">
                    <div
                      className="filter-number me-2"
                      style={{ cursor: "move" }}
                    >
                      <i className="bi bi-grip-vertical me-2"></i>
                      {stateIndex + 1}
                      <button
                        className="btn btn-sm btn-link text-danger p-0 ms-2"
                        onClick={(e) => handleDeleteState(e, stateIndex)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <div className="filter-content">
                      <div className="filter-tags d-flex flex-wrap gap-1">
                        {tags[stateIndex].map((tag, tagIndex) => (
                          <div key={tagIndex} className="tag d-flex align-items-center">
                            <span onClick={() => editTag(stateIndex, tagIndex)}>{tag}</span>
                            <button
                              className="btn btn-sm btn-link text-danger p-0 ms-1"
                              onClick={() => deleteTag(stateIndex, tagIndex)}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          className="btn btn-sm btn-link text-primary add-tag"
                          onClick={() => addTag(stateIndex)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                {variants.map((variant, variantIndex) => (
                  <td key={variantIndex}>
                    <div className="variant-cell d-flex align-items-center justify-content-center">
                      {imageMatrix[stateIndex][variantIndex] ? (
                        <img
                          src={imageMatrix[stateIndex][variantIndex]}
                          alt="Design"
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        <button
                          className="btn add-design-btn btn-sm"
                          onClick={() => openImageModal(stateIndex, variantIndex)}
                        >
                          <i className="bi bi-plus-lg"></i> Add Design
                        </button>
                      )}
                    </div>
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={addVariant}
                  >
                    <i className="bi bi-plus-square"></i> Add Variant
                  </button>
                </td>
              </tr>
            ))}
            {/* Add State Row */}
            <tr>
              <td colSpan={variants.length + 2}>
                <div className="add-state-cell d-flex justify-content-center">
                  <button className="btn btn-primary" onClick={addState}>
                    <i className="bi bi-plus-circle"></i> Add State
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Image Selection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select a Design to Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search designs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="image-grid d-grid gap-3">
            {filteredImages.map((image, index) => (
              <div key={index} className="image-item position-relative">
                <img src={"logo.jpg"} alt={image.alt} className="img-fluid" />
                <Button
                  variant="primary"
                  size="sm"
                  className="insert-btn position-absolute top-50 start-50 translate-middle"
                  onClick={() => insertImage(image)}
                >
                  Insert
                </Button>
              </div>
            ))}
            {filteredImages.length === 0 && <p>No images found.</p>}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
