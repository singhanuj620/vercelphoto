"use client";

import { upload } from "@vercel/blob/client";
import { useState, useRef } from "react";
import { jsPDF } from "jspdf";

export default function AvatarUploadPage() {
  const inputFileRef = useRef(null);
  const [blob, setBlob] = useState(null);

  const handleUpload = async (event) => {
    event.preventDefault();

    const files = inputFileRef.current.files;
    const pdf = new jsPDF();

    const loadImage = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          resolve(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    };

    for (let i = 0; i < files.length; i++) {
      const imgData = await loadImage(files[i]);
      console.log(imgData);
      pdf.addImage(imgData, "JPEG", 10, 10, 180, 160);
      if (i < files.length - 1) {
        pdf.addPage();
      }
    }

    const pdfBlob = pdf.output("blob");
    const newBlob = await upload("document.pdf", pdfBlob, {
      access: "public",
      handleUploadUrl: "/api/avatar/upload",
    });

    setBlob(newBlob);
  };

  return (
    <div className="border-2 border-blue-600 h-screen">
      <div className="h-[20%] flex justify-center items-center text-3xl">
        Upload Your Photo(s)
      </div>
      <form onSubmit={handleUpload}>
        <div className="flex gap-20 flex-col justify-center items-start p-20">
          <div>
            <input
              name="file"
              ref={inputFileRef}
              type="file"
              required
              multiple
            />
          </div>
          <div className="font-bold border-2 border-red-500 w-fit py-2 px-6 rounded-lg cursor-pointer hover:bg-red-500">
            <button type="submit">Upload</button>
          </div>
        </div>
      </form>
      {blob && (
        <div className="p-24">
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </div>
  );
}
