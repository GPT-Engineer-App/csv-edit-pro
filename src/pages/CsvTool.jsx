import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Papa from "papaparse";

const CsvTool = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
        },
        error: (error) => {
          toast.error("Error parsing CSV file");
        },
      });
    }
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName || "edited.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (index, field, value) => {
    const updatedData = [...csvData];
    updatedData[index][field] = value;
    setCsvData(updatedData);
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleDeleteRow = (index) => {
    const updatedData = csvData.filter((_, i) => i !== index);
    setCsvData(updatedData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Management Tool</h1>
      <p className="mb-4">Upload, edit, and download CSV files</p>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {fileName && <p className="mt-2">Uploaded File: {fileName}</p>}
      </div>
      <div className="mb-4">
        <Button onClick={handleAddRow}>Add Row</Button>
      </div>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {csvData.length > 0 &&
                Object.keys(csvData[0]).map((key) => (
                  <TableHead key={key}>{key}</TableHead>
                ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.keys(row).map((field) => (
                  <TableCell key={field}>
                    <Input
                      value={row[field]}
                      onChange={(e) => handleEdit(rowIndex, field, e.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outline" onClick={() => handleDeleteRow(rowIndex)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <Button onClick={handleDownload}>Download CSV</Button>
      </div>
    </div>
  );
};

export default CsvTool;