
import NavBar from '../pages/NavBar';
// import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import './GenerateReport.css';

const GenerateReportComponent = () => {
    const [reportType, setReportType] = useState("daily");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [csvData, setCsvData] = useState(null);
    const [csvUrl, setCsvUrl] = useState(null);


    const navigate = useNavigate(); // Navigation hook
    const generateReport = async () => {
        setLoading(true);
        setError(null);
        setCsvData(null);
        setCsvUrl(null);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/report/generate/", {
                report_type: reportType
            });

            if (Array.isArray(response.data)) {
                setReports(response.data); // Expecting an array of reports
            } else {
                setReports([response.data]); // Fallback in case only one report is returned
            }

            if (response.data.csv_file) {
                setCsvUrl(`http://127.0.0.1:8000${response.data.csv_file}`);
                fetchCSV(response.data.csv_file);
            }
        } catch (err) {
            setError("Failed to generate report.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCSV = async (csvFilePath) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000${csvFilePath}`, {
                responseType: "text",
            });

            const csvText = response.data;
            const rows = csvText.split("\n").map((row) => row.split(","));
            setCsvData(rows);
        } catch (err) {
            setError("Failed to load CSV file.");
        }
    };
    const handleBack = () => {
        navigate('/staff-dashboard'); // Change this route to your Staff Dashboard route
    };
    return (
        
        <div className="generatereport-container">
              <NavBar />
              
            <h2 className="generatereport-header">Generate Report</h2>
            <div className="generatereport-controls">
            <select
                className="generatereport-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
            >
                <option value="daily">Daily Report</option>
                <option value="monthly">Monthly Report</option>
            </select>

            <button
                onClick={generateReport}
                className="generatereport-button"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate"}
            </button>
</div>
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {reports.length > 0 && (
                <div className="generatereport-list">
                    {reports.map((report, index) => (
                        <div key={index} className="generatereport-card">
                            <h3 className="mt-4">{reportType === "daily" ? "Daily Report" : "Monthly Report"}</h3>
                            <p><strong>Date:</strong> {report.date || report.month}</p>
                            <p><strong>Total Orders:</strong> {report.total_orders}</p>
                            <p><strong>Total Revenue:</strong> ${report.total_revenue.toFixed(2)}</p>
                            <h4 className="mt-4 font-semibold">Order Details:</h4>
                            <ul className="generatereport-order-list">
                                {report.orders.length > 0 ? (
                                    [...report.orders] // Create a new sorted copy to avoid mutating original data
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by latest first
                                    .map((order) => (
                                        <li key={order.id} className="generatereport-order-item">
                                            <p><strong>Token:</strong> {order.token}</p>
                                            <p><strong>Customer:</strong> {order.customer_name || "N/A"}</p>
                                            <p><strong>Total Price:</strong> ${order.total_price.toFixed(2)}</p>
                                            <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
                                        </li>
                                    ))
                                ) : (
                                    <p>No orders found.</p>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {csvData && (
                <div className="generatereport-card">
                    <h3 className="text-lg font-bold mb-2">CSV Data</h3>
                    <div className="overflow-x-auto">
                        <table className="generatereport-csv-table">
                            <thead>
                                <tr>
                                    {csvData[0]?.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {csvData.slice(1).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {csvUrl && (
                        <div className="mt-4">
                            <a 
                                href={csvUrl} 
                                download="report.csv" 
                                className="generatereport-csv-download"
                            >
                                Download CSV
                            </a>
                        </div>
                    )}
                </div>
            )}
            <button className="delete-menu-back-button" onClick={handleBack}>
                Back to Staff Dashboard
            </button>

        </div>
    );
};

export default GenerateReportComponent;
