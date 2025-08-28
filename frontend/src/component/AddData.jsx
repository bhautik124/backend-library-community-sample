import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// API Constants
const CRUD_API_URL =
  "http://localhost:8000/api/KbUSQdE/crud-with-image-create-model";
const CRUD_API_KEY = "KqkavYL";
const CRUD_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFlMTFmMjIyNWZmOTUwMjYyMjUzOGQiLCJhcGlLZXkiOiJLcWthdllMIiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS1jcmVhdGUtbW9kZWwiLCJpYXQiOjE3NTYzOTIwNzEsImV4cCI6MTc1ODk4NDA3MX0.eLmvA5zwwTxeF9uJuj7EdBTR1MN6m-vpkXdZTAzoeNw";

const FETCH_MODELS_API_URL =
  "http://localhost:8000/api/zFwkM6F/crud-with-image-get-all-model-with-data";
const FETCH_MODELS_API_KEY = "zFwkM6F";
const FETCH_MODELS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFlMTFmMjIyNWZmOTUwMjYyMjUzOGQiLCJhcGlLZXkiOiJ6RndrTTZGIiwiZmVhdHVyZSI6ImNydWQtd2l0aC1pbWFnZS1nZXQtYWxsLW1vZGVsLXdpdGgtZGF0YSIsImlhdCI6MTc1NjM5MjA0NCwiZXhwIjoxNzU4OTg0MDQ0fQ.Xh72lsWUFysH8-Y8vKBfVf-TD5wwyvDkPxqhE0Jf7xo";

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
    <div className="min-h-screen bg-black p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#18181B] rounded-2xl shadow-xl p-8 transition-all duration-300 border border-zinc-700">
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-[#212125] text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <h1 className="text-3xl font-bold text-white text-center flex-1">
            Add Data to Model
          </h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Error & Success Messages */}
        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900 border-l-4 border-green-500 text-green-200 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Model Selection */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Model
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
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
            >
              <option value="" className="bg-gray-800 text-white">
                Select a model
              </option>
              {models.map((model) => (
                <option
                  key={model.modelName}
                  value={model.modelName}
                  className="bg-gray-800 text-white"
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
              className="px-4 py-2 bg-[#212125] text-white rounded-lg hover:bg-gray-600 transition-colors mt-6"
            >
              {showFields ? "Hide Fields" : "Show Fields"}
            </button>
          )}
        </div>

        {/* Model Fields Display */}
        {selectedModel && showFields && (
          <div className="mb-6 bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-white mb-3">
              Fields for {selectedModel.modelName}
            </h3>
            <ul className="list-disc pl-5">
              {selectedModel.fields.slice(0, -2).map((field) => (
                <li key={field._id} className="text-gray-300">
                  <span className="font-medium capitalize">{field.name}</span>:{" "}
                  {field.type}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Data Entries */}
        {selectedModel && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-white mb-3">
              Data Entries
            </h3>
            {dataEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="mb-2 border border-gray-600 rounded-lg bg-gray-800"
              >
                <button
                  type="button"
                  onClick={() => toggleEntry(entry.id)}
                  className="w-full px-4 py-3 text-left bg-[#212125] rounded-t-lg hover:bg-gray-600 transition-colors flex justify-between items-center"
                >
                  <span className="font-medium text-white">
                    {getEntryLabel(entry, index)}
                  </span>
                  <span className="text-white">{entry.isOpen ? "▲" : "▼"}</span>
                </button>
                {entry.isOpen && (
                  <div className="p-4">
                    {selectedModel.fields
                      .filter(
                        (field) =>
                          field.name !== "imgUrl" && field.name !== "publicId"
                      )
                      .map((field) => (
                        <div key={field._id} className="mb-3">
                          <label className="block text-sm font-medium text-gray-300 capitalize">
                            {field.name}
                          </label>
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
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                            placeholder={`Enter ${field.name}`}
                          />
                        </div>
                      ))}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-300">
                        Image (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(entry.id, e)}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#212125] file:text-white hover:file:bg-gray-600"
                      />
                    </div>
                    {dataEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDataEntry(entry.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove Entry
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDataEntry}
              className="text-indigo-400 hover:text-indigo-300 font-medium mt-3 transition-colors"
            >
              + Add More Data
            </button>
          </div>
        )}

        {/* Submit Add Data */}
        <button
          type="submit"
          disabled={loading || !selectedModel}
          onClick={handleAddData}
          className={`w-full text-white py-3 rounded-lg font-medium transition-all transform ${
            loading || !selectedModel
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#212125] hover:bg-gray-600"
          }`}
        >
          {loading ? "Adding Data..." : "Add Data"}
        </button>
      </div>
    </div>
  );
};

export default AddDataForm;
