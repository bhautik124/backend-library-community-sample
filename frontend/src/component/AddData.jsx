import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// API Constants
const CRUD_API_URL =
  "http://localhost:8000/api/Gpd1HMi/crud-with-image-create-model";
const CRUD_API_KEY = "rAxgpzk";
const CRUD_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFlMTFmMjIyNWZmOTUwMjYyMjUzOGQiLCJhcGlLZXkiOiJyQXhncHprIiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS1jcmVhdGUtbW9kZWwiLCJpYXQiOjE3NTg5MDAxNzcsImV4cCI6MTc2MTQ5MjE3N30.t4-IfSe6_ee8OGpwpTwZnJfBwwkVaMl4CHcjUVqmhgs";

const FETCH_MODELS_API_URL =
  "http://localhost:8000/api/6LkKsNn/crud-with-image-get-all-model-with-data";
const FETCH_MODELS_API_KEY = "6LkKsNn";
const FETCH_MODELS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFlMTFmMjIyNWZmOTUwMjYyMjUzOGQiLCJhcGlLZXkiOiI2TGtLc05uIiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS1nZXQtYWxsLW1vZGVsLXdpdGgtZGF0YSIsImlhdCI6MTc1ODg5NTk5NCwiZXhwIjoxNzYxNDg3OTk0fQ.Y4jEqKr6VqKCl6HDFwR80cJWE1ABQpWrFKqX-hJk5i8";

const AddDataForm = () => {
  // ------------------ STATES ------------------
  const [dataEntries, setDataEntries] = useState([
    { id: Date.now(), fields: {}, image: null, isOpen: false },
  ]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showFields, setShowFields] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  // ------------------ FETCH MODELS ------------------
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const res = await axios.get(FETCH_MODELS_API_URL, {
          headers: {
            "x-api-key": FETCH_MODELS_API_KEY,
            Authorization: `Bearer ${FETCH_MODELS_TOKEN}`,
          },
        });
        setModels(res.data.models || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  // ------------------ HANDLERS ------------------
  const handleDataFieldInput = (entryId, fieldName, value) => {
    setDataEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? { ...entry, fields: { ...entry.fields, [fieldName]: value } }
          : entry
      )
    );
  };

  const handleImageChange = (entryId, e) => {
    setDataEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, image: e.target.files[0] } : entry
      )
    );
  };

  const toggleEntry = (entryId) => {
    setDataEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, isOpen: !entry.isOpen } : entry
      )
    );
  };

  const addDataEntry = () => {
    setDataEntries((prev) => [
      ...prev,
      { id: Date.now(), fields: {}, image: null, isOpen: false },
    ]);
  };

  const removeDataEntry = (entryId) => {
    setDataEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = dataEntries.map((entry) => entry.fields);
      const formData = new FormData();
      formData.append("collectionName", selectedModel.modelName);
      formData.append(
        "fields",
        JSON.stringify(
          selectedModel.fields.reduce(
            (acc, field) => ({ ...acc, [field.name]: field.type }),
            {}
          )
        )
      );
      formData.append("data", JSON.stringify(data));

      dataEntries.forEach((entry) => {
        if (entry.image) {
          formData.append("images", entry.image);
        }
      });

      const res = await axios.post(CRUD_API_URL, formData, {
        headers: {
          "x-api-key": CRUD_API_KEY,
          Authorization: `Bearer ${CRUD_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        "Data added successfully: " + JSON.stringify(res.data, null, 2)
      );
      setDataEntries([
        { id: Date.now(), fields: {}, image: null, isOpen: false },
      ]);
      setSelectedModel(null);
      setShowFields(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/"); // Redirect to home page
  };

  // Get entry label based on the first field
  const getEntryLabel = (entry, index) => {
    if (
      !selectedModel ||
      !selectedModel.fields ||
      !selectedModel.fields.length
    ) {
      return `Entry ${index}`;
    }
    const firstField = selectedModel.fields[0].name;
    return entry.fields[firstField] || `Entry ${index}`;
  };

  return (
    <div className="min-h-screen animated-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/10">
        <nav className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30 rounded-full transition-all duration-300"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gradient">
              Create New Article
            </h1>
            <div className="w-20"></div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 py-12">
        <div className="glass-card rounded-2xl p-8 border border-white/10">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gradient mb-4">
              Share Your Story
            </h2>
            <p className="text-xl text-white/70">
              Create engaging content and connect with your audience
            </p>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="glass-card bg-red-500/10 border-red-500/20 text-red-300 p-6 rounded-xl mb-6 border">
              <div className="flex items-center space-x-3">
                <span className="text-red-400 text-xl">⚠️</span>
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-red-400/80">{error}</p>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className="glass-card bg-green-500/10 border-green-500/20 text-green-300 p-6 rounded-xl mb-6 border">
              <div className="flex items-center space-x-3">
                <span className="text-green-400 text-xl">✅</span>
                <div>
                  <p className="font-semibold">Success</p>
                  <p className="text-green-400/80">Article created successfully!</p>
                </div>
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <label className="block text-lg font-semibold text-white mb-3">
                  Choose Category
                </label>
                <select
                  value={selectedModel?.modelName || ""}
                  onChange={(e) => {
                    const model = models.find(
                      (m) => m.modelName === e.target.value
                    );
                    setSelectedModel(model || null);
                    setShowFields(false);
                    setDataEntries([
                      { id: Date.now(), fields: {}, image: null, isOpen: false },
                    ]);
                  }}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                >
                  <option value="" className="bg-gray-900 text-white">
                    Select a category for your article
                  </option>
                  {models.map((model) => (
                    <option
                      key={model.modelName}
                      value={model.modelName}
                      className="bg-gray-900 text-white"
                    >
                      {model.modelName}
                    </option>
                  ))}
                </select>
              </div>
              {selectedModel && (
                <button
                  type="button"
                  onClick={() => setShowFields(!showFields)}
                  className="ml-4 px-6 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300"
                >
                  {showFields ? "Hide Fields" : "View Fields"}
                </button>
              )}
            </div>

            {/* Category Fields Display */}
            {selectedModel && showFields && (
              <div className="glass-card bg-purple-500/5 border-purple-500/20 p-6 rounded-xl border">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Fields for {selectedModel.modelName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedModel.fields.slice(0, -2).map((field) => (
                    <div key={field._id} className="flex items-center space-x-3 text-white/80">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="font-medium capitalize">{field.name}</span>
                      <span className="text-white/60">({field.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Article Entries */}
          {selectedModel && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">
                Create Articles
              </h3>
              
              <div className="space-y-4">
                {dataEntries.map((entry, index) => (
                  <div key={entry.id} className="blog-card rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleEntry(entry.id)}
                      className="w-full px-6 py-4 bg-white/5 hover:bg-white/10 transition-all duration-300 flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-white text-lg">
                          {getEntryLabel(entry, index + 1)}
                        </span>
                      </div>
                      <span className="text-white text-xl">{entry.isOpen ? "−" : "+"}</span>
                    </button>
                    
                    {entry.isOpen && (
                      <div className="p-6 space-y-5">
                        {selectedModel.fields
                          .filter(
                            (field) =>
                              field.name !== "imgUrl" && field.name !== "publicId"
                          )
                          .map((field) => (
                            <div key={field._id}>
                              <label className="block text-sm font-semibold text-white/80 capitalize mb-2">
                                {field.name}
                              </label>
                              {field.name.toLowerCase().includes('description') || 
                               field.name.toLowerCase().includes('content') ? (
                                <textarea
                                  value={entry.fields[field.name] || ""}
                                  onChange={(e) =>
                                    handleDataFieldInput(
                                      entry.id,
                                      field.name,
                                      e.target.value
                                    )
                                  }
                                  rows={4}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none"
                                  placeholder={`Enter ${field.name}`}
                                />
                              ) : (
                                <input
                                  type={field.type === "Number" ? "number" : "text"}
                                  value={entry.fields[field.name] || ""}
                                  onChange={(e) =>
                                    handleDataFieldInput(
                                      entry.id,
                                      field.name,
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                                  placeholder={`Enter ${field.name}`}
                                />
                              )}
                            </div>
                          ))}
                        
                        <div>
                          <label className="block text-sm font-semibold text-white/80 mb-2">
                            Cover Image (Optional)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(entry.id, e)}
                            className="w-full text-sm text-white/70 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-500/20 file:to-blue-500/20 file:text-white file:font-semibold hover:file:from-purple-500/30 hover:file:to-blue-500/30 transition-all cursor-pointer border border-white/10 rounded-xl p-2"
                          />
                        </div>
                        
                        {dataEntries.length > 1 && (
                          <div className="pt-4 border-t border-white/10">
                            <button
                              type="button"
                              onClick={() => removeDataEntry(entry.id)}
                              className="text-red-400 hover:text-red-300 font-medium transition-colors"
                            >
                              🗑️ Remove Article
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addDataEntry}
                  className="w-full py-4 border-2 border-dashed border-white/20 hover:border-white/40 rounded-xl text-white/70 hover:text-white font-medium transition-all duration-300 hover:bg-white/5"
                >
                  + Add Another Article
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-white/10">
                <button
                  type="submit"
                  disabled={loading || !selectedModel}
                  onClick={handleAddData}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    loading || !selectedModel
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : "btn-gradient text-white shadow-glow"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Publishing Articles...</span>
                    </div>
                  ) : (
                    "🚀 Publish Articles"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDataForm;
