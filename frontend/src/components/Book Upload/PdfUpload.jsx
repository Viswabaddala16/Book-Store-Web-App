import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import BackButton from "../BackButton";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

function PdfUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [lastReadPage, setLastReadPage] = useState(0);
  const [currentBookId, setCurrentBookId] = useState(null);
  const defaultLayout = defaultLayoutPlugin();
  const pdfViewerRef = useRef(null);

  useEffect(() => {
    fetchPdfs();
  }, []);

<<<<<<< HEAD
  const fetchPdfs = async () => {
    try {
      const response = await axios.get("https://book-store-web-app-backend.onrender.com/books/uploads", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Fetched Pdfs", response.data);
      setPdfs(response.data.data);
    } catch (error) {
      enqueueSnackbar("Error fetching PDFs", { variant: "error" });
      console.error("Error fetching PDFs:", error.message);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile || !title) {
      enqueueSnackbar("Please provide a title and select a PDF file.", {
        variant: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    console.log("Uploading:", { title,author,price,selectedFile });
    try {
      await axios.post("https://book-store-web-app-backend.onrender.com/books/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      enqueueSnackbar("File uploaded successfully.", { variant: "success" });
      setTitle("");
      setSelectedFile(null);
      fetchPdfs();
    } catch (error) {
      enqueueSnackbar("Error uploading file.", { variant: "error" });
      console.log("Error uploading file:", error.message);
    }
  };

  const handleViewPdf = async (pdf) => {
    console.log("Selected PDF", pdf);
    setSelectedPdfUrl(pdf.url);
    setCurrentBookId(pdf._id);
    try {
      const response = await axios.get(
        `https://book-store-web-app-backend.onrender.com/books/last-read/${pdf._id}`,
        {
=======
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("https://book-store-web-app-backend.onrender.com/books/uploads", {
>>>>>>> 64c8f012440da791c553601e60d1582a4eebd93b
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setLastReadPage(response.data.lastReadPage || 0);
    } catch (error) {
      console.log("Error fetching last read page", error.message);
    }
    pdfViewerRef.current.scrollIntoView({ behavior: "smooth" });
  };

<<<<<<< HEAD
  // Debounced saveLastReadPage
  const saveLastReadPage = useCallback(
    debounce(async (pageNumber) => {
=======
    const handleFileUpload = async (e) => {
      e.preventDefault();

      if (!selectedFile || !title) {
        enqueueSnackbar("Please provide a title and select a PDF file.", {
          variant: "warning",
        });
        return;
      }

      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("title", title);
      console.log('Uploading:', { title, selectedFile });
      try {
        await axios.post("https://book-store-web-app-backend.onrender.com/books/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        enqueueSnackbar("File uploaded successfully.", { variant: "success" });
        setTitle("");
        setSelectedFile(null);
        fetchPdfs();
      } catch (error) {
        enqueueSnackbar("Error uploading file.", { variant: "error" });
        console.log("Error uploading file:", error.message);
      }
    };
    const handleViewPdf = async (pdf) => {
      console.log("Selected PDf",pdf);
      setSelectedPdfUrl(pdf.url);
      setCurrentBookId(pdf._id);
      try{
        const response = await axios.get(
          `https://book-store-web-app-backend.onrender.com/books/last-read/${pdf._id}`,
          {
            headers : {Authorization : `Bearer ${localStorage.getItem('token')}`},
          }
        );
        setLastReadPage(response.data.lastReadPage || 0);
      }catch(error){
        console.log("Error fetching last read page",error.message);
      }
      pdfViewerRef.current.scrollIntoView({behavior  : 'smooth'});
      // `http://localhost:5555/${filePath}`
    };
    const saveLastReadPage = async(pageNumber) => {
>>>>>>> 64c8f012440da791c553601e60d1582a4eebd93b
      if (!currentBookId) {
        console.warn("Cannot save last read page, no currentBookId set.");
        return;
      }
<<<<<<< HEAD
      try {
        await axios.post(
          `https://book-store-web-app-backend.onrender.com/books/last-read/${currentBookId}`,
          {
            lastReadPage: pageNumber,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setLastReadPage(pageNumber);
        enqueueSnackbar("Last read page saved successfully.", {
          variant: "success",
        });
      } catch (error) {
        console.error("Error saving last read page:", error.message);
=======
      try{
        const currentPdf = pdfs.find((pdf) => pdf.url === selectedPdfUrl);
        if(currentPdf){
          await axios.post(
            `https://book-store-web-app-backend.onrender.com/books/last-read/${currentBookId}`,
            {
              lastReadPage: pageNumber  
            },
            {
              headers : {Authorization: `Bearer ${localStorage.getItem('token')}`},
            }
          );
          setLastReadPage(pageNumber);
          enqueueSnackbar("Last read page saved successfully.", { variant: "success" });
        }
      } catch(error){
        console.error("Error saving last read page :",error.message);
>>>>>>> 64c8f012440da791c553601e60d1582a4eebd93b
        enqueueSnackbar("Error saving last read page.", { variant: "error" });
      }
    }, 2000),
    [currentBookId, enqueueSnackbar]
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveLastReadPage(lastReadPage);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [lastReadPage, currentBookId, saveLastReadPage]);

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg bg-orange-300">
      <BackButton />
      <form
        onSubmit={handleFileUpload}
        className="flex flex-col items-center gap-4 mb-8 mt-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        >
          Upload PDF
        </button>
      </form>

      <h3 className="text-2xl font-semibold text-center mb-4">Uploaded PDFs</h3>
      <ul className="space-y-4">
        {pdfs.map((pdf) => (
          <li
            key={pdf._id}
            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-white shadow-md"
          >
            <span className="font-medium">{pdf.title}</span>
            <button
              onClick={() => handleViewPdf(pdf)}
              className="text-blue-500 hover:underline"
            >
              View
            </button>
          </li>
        ))}
      </ul>
      {selectedPdfUrl && (
        <div
          className="mt-8 p-4 border border-gray-200 rounded-lg bg-white shadow-md"
          ref={pdfViewerRef}
        >
          <h4 className="text-lg font-semibold mb-4">PDF Viewer</h4>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <div className="pdf-viewer" style={{ height: "600px" }}>
              <Viewer
                fileUrl={selectedPdfUrl}
                plugins={[defaultLayout]}
                initialPage={lastReadPage - 1}
                onPageChange={(e) => saveLastReadPage(e.currentPage)}
              />
            </div>
          </Worker>
        </div>
      )}
    </div>
  );
}

export default PdfUpload;
