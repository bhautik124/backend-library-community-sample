import React, { useEffect, useState } from "react";
import axios from "axios";

// ------------------ API Constants ------------------
const CRUD_UPDATE_API_URL =
  "http://localhost:8000/api/KvKFpSm/crud-with-image-update";
const CRUD_UPDATE_API_KEY = "o0ujSj8";
const CRUD_UPDATE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFlMTFmMjIyNWZmOTUwMjYyMjUzOGQiLCJhcGlLZXkiOiJvMHVqU2o4IiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS11cGRhdGUiLCJpYXQiOjE3NTYzOTI5OTMsImV4cCI6MTc1ODk4NDk5M30.p1C1vVoCdZGl6L3fKmxyzYQQnuKTfvaMU4PA91UH3rw";

const CRUD_DELETE_API_URL =
  "http://localhost:8000/api/5zwHrwB/crud-with-image-delete";
const CRUD_DELETE_API_KEY = "xaEUlCl";
const CRUD_DELETE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFlMTFmMjIyNWZmOTUwMjYyMjUzOGQiLCJhcGlLZXkiOiJ4YUVVbENsIiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS1kZWxldGUiLCJpYXQiOjE3NTYzOTM3NzYsImV4cCI6MTc1ODk4NTc3Nn0.6EH9eG2pHHTy-r3jCvg4O727wRwlfmoziE6rZ8nCy4s";

const CRUD_DELETE_MODEL_API_URL =
  "http://localhost:8000/api/q85em18/crud-with-image-whole-modeldelete";
const CRUD_DELETE_MODEL_API_KEY = "q85em18";
const CRUD_DELETE_MODEL_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFlMTFmMjIyNWZmOTUwMjYyMjUzOGQiLCJhcGlLZXkiOiJxODVlbTE4IiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS13aG9sZS1tb2RlbGRlbGV0ZSIsImlhdCI6MTc1NjM5NDQxNSwiZXhwIjoxNzU4OTg2NDE1fQ.khlueySDRDiI_oVJjBFZ1eBaTwG9eZPjHfKqtGn8W1A";

const FETCH_MODELS_API_URL =
  "http://localhost:8000/api/Z83LrNg/crud-with-image-get-all-model-with-data";
const FETCH_MODELS_API_KEY = "Z83LrNg";
const FETCH_MODELS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFlMTFmMjIyNWZmOTUwMjYyMjUzOGQiLCJhcGlLZXkiOiJaODNMck5nIiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS1nZXQtYWxsLW1vZGVsLXdpdGgtZGF0YSIsImlhdCI6MTc1NjM5Mjk3MywiZXhwIjoxNzU4OTg0OTczfQ.YUrgZ-57hUiMoVm9Jrtsj8GKnpk48HaGmKLyrDCf3aE";

// Pagination constant
const ITEMS_PER_PAGE = 2;

export default function WholeContent() {
  const [models, setModels] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null); // For update modal
  const [selectedDeleteDoc, setSelectedDeleteDoc] = useState(null); // For document deletion modal
  const [selectedModel, setSelectedModel] = useState(null); // For model deletion modal
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});

  // ---------------- Fetch models + data ----------------
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const { data } = await axios.get(FETCH_MODELS_API_URL, {
          headers: {
            "x-api-key": FETCH_MODELS_API_KEY,
            Authorization: `Bearer ${FETCH_MODELS_TOKEN}`,
          },
        });
        const fetchedModels = data.models || [];
        setModels(fetchedModels);

        // Initialize pagination state for each model
        const initialPagination = {};
        fetchedModels.forEach((model) => {
          initialPagination[model.modelName] = 1;
        });
        setPagination(initialPagination);
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  // ---------------- Handle Pagination ----------------
  const handlePageChange = (modelName, direction) => {
    setPagination((prev) => {
      const currentPage = prev[modelName];
      const modelData =
        models.find((m) => m.modelName === modelName)?.data || [];
      const totalPages = Math.ceil(modelData.length / ITEMS_PER_PAGE);
      let newPage = currentPage;

      if (direction === "next" && currentPage < totalPages) {
        newPage++;
      } else if (direction === "prev" && currentPage > 1) {
        newPage--;
      }

      return { ...prev, [modelName]: newPage };
    });
  };

  // ---------------- Handle Update Form ----------------
  const handleUpdate = (modelName, doc) => {
    setSelectedDoc({ modelName, ...doc });
    setFormData(doc);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const submitUpdate = async () => {
    try {
      const form = new FormData();
      form.append("collectionName", selectedDoc.modelName);
      form.append("id", selectedDoc._id);

      // Create a clean data object for the update, removing protected fields
      const dataToUpdate = { ...formData };
      delete dataToUpdate._id;
      delete dataToUpdate.__v;
      delete dataToUpdate.imgUrl;
      delete dataToUpdate.publicId;
      delete dataToUpdate.createdAt;
      delete dataToUpdate.updatedAt;

      form.append("data", JSON.stringify(dataToUpdate));
      if (file) form.append("file", file);

      await axios.put(CRUD_UPDATE_API_URL, form, {
        headers: {
          "x-api-key": CRUD_UPDATE_API_KEY,
          Authorization: `Bearer ${CRUD_UPDATE_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Updated Successfully ✅");

      // Refresh models after update
      const refreshed = await axios.get(FETCH_MODELS_API_URL, {
        headers: {
          "x-api-key": FETCH_MODELS_API_KEY,
          Authorization: `Bearer ${FETCH_MODELS_TOKEN}`,
        },
      });
      setModels(refreshed.data.models);
      setSelectedDoc(null);
      setFile(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Update failed ❌");
    }
  };

  // ---------------- Handle Document Delete ----------------
  const handleDeleteClick = (modelName, id) => {
    setSelectedDeleteDoc({ modelName, id });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(CRUD_DELETE_API_URL, {
        headers: {
          "x-api-key": CRUD_DELETE_API_KEY,
          Authorization: `Bearer ${CRUD_DELETE_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          collectionName: selectedDeleteDoc.modelName,
          id: selectedDeleteDoc.id,
        },
      });

      alert("Document deleted ✅");

      // Refresh models after deletion
      const refreshed = await axios.get(FETCH_MODELS_API_URL, {
        headers: {
          "x-api-key": FETCH_MODELS_API_KEY,
          Authorization: `Bearer ${FETCH_MODELS_TOKEN}`,
        },
      });
      setModels(refreshed.data.models);
      setSelectedDeleteDoc(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Deletion failed ❌");
    }
  };

  // ---------------- Handle Model Delete ----------------
  const handleModelDeleteClick = (modelName) => {
    setSelectedModel(modelName);
  };

  const confirmModelDelete = async () => {
    try {
      await axios.delete(CRUD_DELETE_MODEL_API_URL, {
        headers: {
          "x-api-key": CRUD_DELETE_MODEL_API_KEY,
          Authorization: `Bearer ${CRUD_DELETE_MODEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          collectionName: selectedModel,
        },
      });

      alert(`Model '${selectedModel}' deleted ✅`);

      // Refresh models after deletion
      const refreshed = await axios.get(FETCH_MODELS_API_URL, {
        headers: {
          "x-api-key": FETCH_MODELS_API_KEY,
          Authorization: `Bearer ${FETCH_MODELS_TOKEN}`,
        },
      });
      setModels(refreshed.data.models);
      setSelectedModel(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(`Deletion of model '${selectedModel}' failed ❌`);
    }
  };

  // ---------------- UI ----------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
        <span className="mt-4 text-lg font-medium text-gray-400">
          Loading models...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="bg-red-900/20 text-red-400 p-6 rounded-xl shadow-lg max-w-md text-center border border-red-500/30">
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 py-12 px-6 sm:px-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-10 text-center tracking-tight">
        All Models
      </h1>

      {models.length === 0 ? (
        <div className="text-center text-gray-500 text-xl font-medium">
          No models found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {models.map((model, idx) => {
            // Pagination calculations
            const currentPage = pagination[model.modelName] || 1;
            const totalPages = Math.ceil(model.data.length / ITEMS_PER_PAGE);
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedData = model.data.slice(startIndex, endIndex);

            return (
              <div
                key={idx}
                className="bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-blue-500/10 transition-shadow duration-300 border border-gray-800 flex flex-col"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-100">
                    {model.modelName}
                  </h2>
                  <button
                    onClick={() => handleModelDeleteClick(model.modelName)}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200"
                  >
                    Delete Model
                  </button>
                </div>

                <div className="flex-grow space-y-4">
                  {paginatedData.length === 0 && model.data.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">
                      No data available
                    </p>
                  ) : (
                    paginatedData.map((doc, index) => (
                      <div
                        key={index}
                        className="border-t border-gray-700 pt-4"
                      >
                        {/* Fields */}
                        {Object.entries(doc).map(
                          ([k, v]) =>
                            k !== "_id" &&
                            k !== "__v" &&
                            k !== "imgUrl" &&
                            k !== "publicId" &&
                            k !== "createdAt" &&
                            k !== "updatedAt" && (
                              <div key={k} className="text-sm mb-3">
                                <span className="font-medium capitalize text-gray-300 block">
                                  {k}:
                                </span>
                                <span className="text-gray-400 break-all mt-1 block">
                                  {String(v) || "-"}
                                </span>
                              </div>
                            )
                        )}

                        {/* Image */}
                        {doc.imgUrl && (
                          <div className="mt-2">
                            <span className="font-medium capitalize text-sm text-gray-300 block mb-2">
                              Image:
                            </span>
                            <a
                              href={doc.imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={doc.imgUrl}
                                alt="Uploaded"
                                className="w-full h-32 object-cover rounded-lg border border-gray-700 shadow-sm hover:opacity-80 transition-opacity duration-200"
                              />
                            </a>
                          </div>
                        )}

                        {/* Update and Delete buttons */}
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleUpdate(model.modelName, doc)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                          >
                            Update
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClick(model.modelName, doc._id)
                            }
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
                    <button
                      onClick={() => handlePageChange(model.modelName, "prev")}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
                    >
                      Prev
                    </button>
                    <span className="text-xs text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(model.modelName, "next")}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Update Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">
              Update {selectedDoc.modelName}
            </h3>

            {Object.entries(formData).map(
              ([k, v]) =>
                k !== "_id" &&
                k !== "__v" &&
                k !== "imgUrl" &&
                k !== "publicId" &&
                k !== "createdAt" &&
                k !== "updatedAt" && (
                  <div key={k} className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 capitalize mb-1">
                      {k}
                    </label>
                    <input
                      type="text"
                      name={k}
                      value={v || ""}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                )
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Update Image
              </label>
              <input
                type="file"
                onChange={handleFile}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600/20 file:text-blue-300 hover:file:bg-blue-600/30 transition-all cursor-pointer"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitUpdate}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                Save
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                className="flex-1 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Delete Confirmation Modal */}
      {selectedDeleteDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this item from{" "}
              {selectedDeleteDoc.modelName}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedDeleteDoc(null)}
                className="flex-1 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Delete Confirmation Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">
              Confirm Model Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the model {selectedModel}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmModelDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedModel(null)}
                className="flex-1 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
