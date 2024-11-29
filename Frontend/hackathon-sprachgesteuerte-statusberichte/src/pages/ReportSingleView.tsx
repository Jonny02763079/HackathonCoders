import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const getReportById = async (id: string) => {
    try {
        const res = await fetch(`http://64.226.84.217:8055/items/reports/${id}`);
        if (!res.ok) {
            console.error(`Error: ${res.status} ${res.statusText}`);
            return null;
        }
        return await res.json();
    } catch (error) {
        console.error('Could not load data', error);
        return null;
    }
};

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        height: "90vh",
        padding: 40,
        backgroundColor: '#E4E4E4',
        gap: 10
    },
    section: {
        marginBottom: 30,
        padding: 10,
        border: '1px solid #000',
        borderRadius: 4
    },
    subTitle: {
        fontSize: 16,
        fontWeight: "bold",
        paddingBottom: 3
    },
    title: {
        marginBottom: 10,
        fontSize: 32,
        fontWeight: "bold"
    },
    flexed: {
        display: "flex"
    },
    longDescriptions: {
        fontSize: 14
    }
});

type ReportData = {
    title: string;
    date_created: string;
    construction_site: string;
    work_done_description?: string;
    material_used_description?: string;
    problems_emerged_description?: string;
    further_notes_description?: string;
};

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm} ${dd}:${hh}`;
};

const ReportSingleView = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<ReportData | null>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            const result = await getReportById(id);
            if (!result) setError(true);
            setData(result);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const MyDocument = ({ data }: { data: ReportData }) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View >
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.title}>Titel: {data.data.title}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.subTitle}>Erstellt am: {formatDate(data.data.date_created)}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.subTitle}>Bericht Id: {data.data.id}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.subTitle}>Baustelle: {data.data.construction_site}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.subTitle}>Erledigte Arbeit:</Text>
                        <Text style={styles.longDescriptions}>{data.data.work_done_description || "keine Angabe"}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.subTitle}>Materialien verwendet:</Text>
                        <Text style={styles.longDescriptions}>{data.data.material_used_description || "keine Angabe"}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.subTitle}>Aufgetauchte Probleme:</Text>
                        <Text style={styles.longDescriptions}>{data.data.problems_emerged_description || "keine Angabe"}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.subTitle}>Sonstige Anmerkungen:</Text>
                        <Text style={styles.longDescriptions}>{data.data.further_notes_description || "keine Angabe"}</Text>
                    </View>
                </View>
            </Page>
        </Document >
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: Could not load the report.</div>;
    if (!data) return <div>No data available</div>;

    return (
        <div className='flex items-center flex-col bg-[#F4F8FB] px-[25%] py-[3%]'>
            <div>
                <div style={{ marginBottom: 10 }}>
                    <div style={styles.title}>Titel: {data.data.title}</div>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <div style={styles.subTitle}>Erstellt am: {formatDate(data.data.date_created)}</div>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <div style={styles.subTitle}>Bericht Id: {data.data.id}</div>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <div style={styles.subTitle}>Baustelle: {data.data.construction_site}</div>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <div style={styles.subTitle}>Erledigte Arbeit:</div>
                    <div style={styles.longDescriptions}>{data.data.work_done_description || "keine Angabe"}</div>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <div style={styles.subTitle}>Materialien verwendet:</div>
                    <div style={styles.longDescriptions}>{data.data.material_used_description || "keine Angabe"}</div>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <div style={styles.subTitle}>Aufgetauchte Probleme:</div>
                    <div style={styles.longDescriptions}>{data.data.problems_emerged_description || "keine Angabe"}</div>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <div style={styles.subTitle}>Sonstige Anmerkungen:</div>
                    <div style={styles.longDescriptions}>{data.data.further_notes_description || "keine Angabe"}</div>
                </div>
            </div>
            <div style={{ backgroundColor: "#3777AD", padding: 20, color: "white", width: "fit-content", borderRadius: 15, cursor: "pointer" }}>
                <PDFDownloadLink document={<MyDocument data={data} />} fileName={`report_${data.data.id}.pdf`}>
                    {({ loading }) => (loading ? 'Dokument lädt...' : 'Bericht herunterladen')}
                </PDFDownloadLink>
            </div>
        </div>
    );
};

export default ReportSingleView;
