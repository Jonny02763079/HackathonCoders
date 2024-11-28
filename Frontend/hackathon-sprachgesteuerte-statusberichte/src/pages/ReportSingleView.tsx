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
        let beginLeft = 20;
        let beginRight = 70;
        //JSON.stringify(data
        console.log(data);

        if (data) {
            doc.setFontSize(20);
            doc.text(`Title: ${id}`, beginLeft, 30);

            doc.setFontSize(12);
            doc.text('Details:', beginLeft, 40);

            doc.setFontSize(10);
            doc.text("Erstellt am:", beginLeft, 50);
            doc.text(JSON.stringify(data.data.date_created), beginRight, 50);
            doc.text("Baustelle", beginLeft, 60);
            doc.text(JSON.stringify(data.data.construction_site), beginRight, 60);
            doc.text("Arbeit erledigt", beginLeft, 70);
            doc.text(JSON.stringify(data.data.work_done_description), beginLeft, 80);
            doc.text("Materialien verwendet", beginLeft, 90);
            doc.text(JSON.stringify(data.data.work_done_description), beginLeft, 100);
            doc.text("Aufgetauchte Problemen", beginLeft, 110);
            doc.text(JSON.stringify(data.data.problems_emerged_description), beginLeft, 120);
            doc.text("Weitere Anmerkungen", beginLeft, 130);
            doc.text(JSON.stringify(data.data.work_done_description), beginLeft, 140);
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
