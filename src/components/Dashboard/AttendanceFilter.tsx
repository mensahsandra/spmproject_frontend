import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
    filterType: "day" | "week" | "month";
    setFilterType: (value: "day" | "week" | "month") => void;
    selectedDate: string;
    setSelectedDate: (value: string) => void;
}

export default function AttendanceFilter({
    filterType,
    setFilterType,
    selectedDate,
    setSelectedDate,
}: Props) {
    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body d-flex flex-wrap gap-3 align-items-center">
                <div>
                    <label className="form-label fw-semibold mb-1">Filter By</label>
                    <select
                        className="form-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as "day" | "week" | "month")}
                    >
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
                <div>
                    <label className="form-label fw-semibold mb-1">Select Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
