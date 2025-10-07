import React, { useEffect, useState } from "react";
import axios from "axios";

// ------------------ API Constants ------------------
const CRUD_UPDATE_API_URL =
  "https://backendlibraryy-fullstack-backend.onrender.com/api/MgpU82Y/crud-with-image-update";
const CRUD_UPDATE_API_KEY = "hXVJ7Zq";
const CRUD_UPDATE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU1NzU5ZTM3OTgwYzM2M2FlMWQ4ZjIiLCJhcGlLZXkiOiJoWFZKN1pxIiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS11cGRhdGUiLCJpYXQiOjE3NTk4Njg0ODgsImV4cCI6MTc2MjQ2MDQ4OH0.ipC98f9dAemlMvlnYueudTnNALeIqPj6zdsh0fYfz-g";

const CRUD_DELETE_API_URL =
  "https://backendlibraryy-fullstack-backend.onrender.com/api/WToBZTV/crud-with-image-delete";
const CRUD_DELETE_API_KEY = "sFI2MoC";
const CRUD_DELETE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU1NzU5ZTM3OTgwYzM2M2FlMWQ4ZjIiLCJhcGlLZXkiOiJzRkkyTW9DIiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS1kZWxldGUiLCJpYXQiOjE3NTk4Njg1MjYsImV4cCI6MTc2MjQ2MDUyNn0.6B6_-woYQfe0SbKKhpRte_4UUUEc5zJ_o-ZF3J7nnXU";

const CRUD_DELETE_MODEL_API_URL =
  "https://backendlibraryy-fullstack-backend.onrender.com/api/Ghl5Vms/crud-with-image-whole-modeldelete";
const CRUD_DELETE_MODEL_API_KEY = "SP3gowK";
const CRUD_DELETE_MODEL_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU1NzU5ZTM3OTgwYzM2M2FlMWQ4ZjIiLCJhcGlLZXkiOiJTUDNnb3dLIiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS13aG9sZS1tb2RlbGRlbGV0ZSIsImlhdCI6MTc1OTg2ODU2MSwiZXhwIjoxNzYyNDYwNTYxfQ.zQk9vQV7jtJziGcy9qXEBN9OOU2-J_sOmQ0INkGxS7Y";

const FETCH_MODELS_API_URL =
  "https://backendlibraryy-fullstack-backend.onrender.com/api/oqXvFP4/crud-with-image-get-all-model-with-data";
const FETCH_MODELS_API_KEY = "oqXvFP4";
const FETCH_MODELS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU1NzU5ZTM3OTgwYzM2M2FlMWQ4ZjIiLCJhcGlLZXkiOiJvcVh2RlA0IiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS1nZXQtYWxsLW1vZGVsLXdpdGgtZGF0YSIsImlhdCI6MTc1OTg2ODg1MywiZXhwIjoxNzYyNDYwODUzfQ.Gc-zBKxpXXeXAR0KRd98qgTIqbDVFeB1WQ25vphfXfQ";

// Pagination constant
const ITEMS_PER_PAGE = 3;

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
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin pulse-ring"></div>
        </div>
        <span className="mt-6 text-lg font-medium text-white/80">
          Loading your content...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] px-6">
        <div className="glass-card bg-red-500/10 text-red-300 p-8 rounded-2xl shadow-xl max-w-md text-center border border-red-500/20">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-xl">⚠</span>
          </div>
          <p className="text-lg font-semibold">Oops! Something went wrong</p>
          <p className="text-red-400/80 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
          Featured Articles
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Discover our latest posts, insights, and stories from our amazing
          community
        </p>
      </div>

      {models.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            No articles yet
          </h3>
          <p className="text-white/70 mb-8">
            Be the first to share your story with the world!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {models.map((model, idx) => {
            // Pagination calculations
            const currentPage = pagination[model.modelName] || 1;
            const totalPages = Math.ceil(model.data.length / ITEMS_PER_PAGE);
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedData = model.data.slice(startIndex, endIndex);

            return (
              <div key={idx} className="space-y-6">
                {/* Category Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {model.modelName}
                    </h3>
                    <p className="text-white/60">
                      {model.data.length}{" "}
                      {model.data.length === 1 ? "article" : "articles"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleModelDeleteClick(model.modelName)}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-full text-sm font-medium transition-all duration-300"
                  >
                    Delete Category
                  </button>
                </div>

                {/* Articles Grid */}
                {paginatedData.length === 0 && model.data.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="text-white/60 text-lg">
                      No articles in this category yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {paginatedData.map((doc, index) => (
                      <article
                        key={index}
                        className="blog-card rounded-2xl overflow-hidden group"
                      >
                        {/* Article Image */}
                        {doc.imgUrl ? (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={doc.imgUrl}
                              alt="Article cover"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                            <span className="text-4xl">📝</span>
                          </div>
                        )}

                        {/* Article Content */}
                        <div className="p-6">
                          {/* Article Fields */}
                          <div className="space-y-4 mb-6">
                            {Object.entries(doc).map(
                              ([k, v]) =>
                                k !== "_id" &&
                                k !== "__v" &&
                                k !== "imgUrl" &&
                                k !== "publicId" &&
                                k !== "createdAt" &&
                                k !== "updatedAt" && (
                                  <div key={k}>
                                    {k.toLowerCase().includes("title") ||
                                    k.toLowerCase().includes("name") ? (
                                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                        {String(v) || "Untitled"}
                                      </h4>
                                    ) : k
                                        .toLowerCase()
                                        .includes("description") ||
                                      k.toLowerCase().includes("content") ? (
                                      <p className="text-white/80 leading-relaxed line-clamp-3">
                                        {String(v) ||
                                          "No description available"}
                                      </p>
                                    ) : (
                                      <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-medium text-purple-300 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">
                                          {k}: {String(v) || "-"}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )
                            )}
                          </div>

                          {/* Article Actions */}
                          <div className="flex gap-3 pt-4 border-t border-white/10">
                            <button
                              onClick={() => handleUpdate(model.modelName, doc)}
                              className="flex-1 btn-gradient px-4 py-2.5 rounded-full text-white text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(model.modelName, doc._id)
                              }
                              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-full text-sm font-medium transition-all duration-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4 pt-8">
                    <button
                      onClick={() => handlePageChange(model.modelName, "prev")}
                      disabled={currentPage === 1}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-white/20 rounded-full text-white font-medium transition-all duration-300"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center space-x-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              [model.modelName]: i + 1,
                            }))
                          }
                          className={`w-10 h-10 rounded-full font-medium transition-all duration-300 ${
                            currentPage === i + 1
                              ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-glow"
                              : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(model.modelName, "next")}
                      disabled={currentPage === totalPages}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-white/20 rounded-full text-white font-medium transition-all duration-300"
                    >
                      Next →
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-white/20 animate-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gradient">Edit Article</h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              {Object.entries(formData).map(
                ([k, v]) =>
                  k !== "_id" &&
                  k !== "__v" &&
                  k !== "imgUrl" &&
                  k !== "publicId" &&
                  k !== "createdAt" &&
                  k !== "updatedAt" && (
                    <div key={k}>
                      <label className="block text-sm font-medium text-white/80 capitalize mb-2">
                        {k}
                      </label>
                      {k.toLowerCase().includes("description") ||
                      k.toLowerCase().includes("content") ? (
                        <textarea
                          name={k}
                          value={v || ""}
                          onChange={handleChange}
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none"
                          placeholder={`Enter ${k}`}
                        />
                      ) : (
                        <input
                          type="text"
                          name={k}
                          value={v || ""}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                          placeholder={`Enter ${k}`}
                        />
                      )}
                    </div>
                  )
              )}

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Update Cover Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFile}
                    accept="image/*"
                    className="w-full text-sm text-white/70 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-500/20 file:to-blue-500/20 file:text-white file:font-medium hover:file:from-purple-500/30 hover:file:to-blue-500/30 transition-all cursor-pointer border border-white/10 rounded-xl p-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
              <button
                onClick={submitUpdate}
                className="flex-1 btn-gradient px-6 py-3 rounded-full text-white font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30 rounded-full font-semibold transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Delete Confirmation Modal */}
      {selectedDeleteDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Delete Article?
              </h3>
              <p className="text-white/70 mb-8">
                Are you sure you want to delete this article from{" "}
                <span className="text-purple-300 font-semibold">
                  {selectedDeleteDoc.modelName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedDeleteDoc(null)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30 rounded-full font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Delete Confirmation Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">🗂️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Delete Category?
              </h3>
              <p className="text-white/70 mb-8">
                Are you sure you want to delete the{" "}
                <span className="text-purple-300 font-semibold">
                  {selectedModel}
                </span>{" "}
                category? All articles in this category will be permanently
                deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmModelDelete}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  Delete Category
                </button>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30 rounded-full font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
