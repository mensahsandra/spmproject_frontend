import RecordAttendance from '../components/Dashboard/RecordAttendance';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

function RecordAttendancePage() {
    return (
        <DashboardLayout showGreeting={true}>
            <RecordAttendance />
        </DashboardLayout>
    );
}

export default RecordAttendancePage;
