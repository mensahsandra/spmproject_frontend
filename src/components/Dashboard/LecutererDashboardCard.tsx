import React from "react";
import { FaQrcode, FaClipboardList, FaEdit, FaFileExport } from "react-icons/fa";
import InfoCard from "../../utils/InfoCard";
import GenerateSessionCode from "./GenerateSession";
import AttendanceLogs from "./AttendanceLogs";
import UpdateGrades from "./UpdateGrades";
import ExportReports from "./ExportReports";

type LecturerDashboardProps = {
    active: string;
    setActive: (section: string) => void;
};

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ active, setActive }) => {
    const detailedSections = ["Generate-Session-Code", "View-Attendance-Log", "Update-Grade", "Export"] as const;
    const showGrid = !active || !detailedSections.includes(active as any);

    return (
        <div
            style={{
                maxWidth: 900,
                margin: "0 auto",
                padding: "0 20px",
                boxSizing: "border-box",
            }}
        >
            {active === "Generate-Session-Code" && (
                <div style={{ marginBottom: 32 }}>
                    <GenerateSessionCode />
                </div>
            )}
            {active === "View-Attendance-Log" && (
                <div style={{ marginBottom: 32 }}>
                    <AttendanceLogs />
                </div>
            )}
            {active === "Update-Grade" && (
                <div style={{ marginBottom: 32 }}>
                    <UpdateGrades />
                </div>
            )}
            {active === "Export" && (
                <div style={{ marginBottom: 32 }}>
                    <ExportReports />
                </div>
            )}

            {showGrid && (
            <>
            {/* Top full-width card */}
            <div style={{ marginBottom: 24 }}>
                <InfoCard
                    title="Generate Session Code"
                    description="Create a new session code for your class."
                    Icon={FaQrcode}
                    topColor="#064e3b"
                    bottomColor="#10b981"
                    onClick={() => setActive("Generate-Session-Code")}
                    hoverEffect={active !== "Generate-Session-Code"}
                    style={{ width: "100%" }}
                />
            </div>

            {/* Two smaller cards side-by-side, stack on mobile */}
            <div
                style={{
                    display: "flex",
                    gap: 20,
                    marginBottom: 24,
                    flexWrap: "wrap",
                }}
            >
                <InfoCard
                    title="View Attendance Log"
                    description="Review attendance records for your sessions."
                    Icon={FaClipboardList}
                    topColor="#047857"
                    bottomColor="#34d399"
                    onClick={() => setActive("View-Attendance-Log")}
                    hoverEffect={active !== "View-Attendance-Log"}
                    style={{ flex: "1 1 300px", minWidth: "250px" }}
                />
                <InfoCard
                    title="Update Grade"
                    description="Input or modify student grades."
                    Icon={FaEdit}
                    topColor="#065f46"
                    bottomColor="#6ee7b7"
                    onClick={() => setActive("Update-Grade")}
                    hoverEffect={active !== "Update-Grade"}
                    style={{ flex: "1 1 300px", minWidth: "250px" }}
                />
            </div>

            {/* Bottom full-width card */}
            <div>
                <InfoCard
                    title="Export"
                    description="Export attendance and grade reports."
                    Icon={FaFileExport}
                    topColor="#047857"
                    bottomColor="#10b981"
                    onClick={() => setActive("Export")}
                    hoverEffect={active !== "Export"}
                    style={{ width: "100%" }}
                />
            </div>
            </>
            )}
        </div>
    );
};

export default LecturerDashboard;
