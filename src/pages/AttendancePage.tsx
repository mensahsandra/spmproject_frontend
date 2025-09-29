import RecordAttendance from '../components/Dashboard/RecordAttendance';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

function RecordAttendancePage() {
    return (
        <DashboardLayout showGreeting={true} maxWidth={800}>
            <RecordAttendance />
        </DashboardLayout>
    );
}

export default RecordAttendancePage;
