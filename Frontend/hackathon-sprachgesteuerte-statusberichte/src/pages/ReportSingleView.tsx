import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const getReportById = async (id: string) => {
    try {
        const res = await fetch(`http://64.226.84.217:8055/items/reports/${id}`);
        if (!res.ok) {
            console.error(`Error: ${res.status} ${res.statusText}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('Could not load data', error);
        return null;
    }
};

export default function ReportSingleView() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            const result = await getReportById(id);
            setData(result);
            setLoading(false);
        };

        fetchData();
    }, [id]);

    const generatePDF = () => {
        const doc = new jsPDF();

        if (data) {
            doc.setFontSize(20);
            doc.text(`Report ID: ${id}`, 20, 30);
            doc.setFontSize(12);
            doc.text(`Title: ${data.title || 'N/A'}`, 20, 20);
            doc.text(`Description: ${data.description || 'N/A'}`, 20, 30);

            doc.setFontSize(10);
            doc.text('Details:', 20, 40);
            doc.text(JSON.stringify(data, null, 2), 20, 50);

            doc.save(`report_${id}.pdf`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>Error loading report.</div>;
    }

    return (
        <div>
            <h1>Report Details</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <button onClick={generatePDF}>Export as PDF</button>
        </div>
    );
}
