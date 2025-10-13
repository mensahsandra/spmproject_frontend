/**
 * Frontend Integration Examples
 * 
 * This file shows how to use the updated assessment system according to backend guidance.
 */

// Example 1: Loading student assessments with proper course handling
/*
import { getStudentAssessments } from './utils/studentAssessments';

const MyComponent = () => {
  const [assessments, setAssessments] = useState([]);
  
  useEffect(() => {
    const loadAssessments = async () => {
      // This automatically handles:
      // - Both student.courses[] (preferred) and student.course (legacy)
      // - Empty assessments array as valid response
      // - Filtering out archived assessments
      // - Treating missing isPublished as published
      
      const result = await getStudentAssessments({ useFallback: true });
      if (result.success) {
        setAssessments(result.assessments);
        console.log(result.message); // "No active assessments" or "Found X assessment(s)"
      }
    };
    
    loadAssessments();
  }, []);
  
  return (
    <div>
      {assessments.map(assessment => (
        <div key={assessment.id}>
          <h3>{assessment.title}</h3>
          
          // Show submission status if available
          {assessment.submission && (
            <div>
              Status: {assessment.submission.status}
              {assessment.submission.score && ` - Score: ${assessment.submission.score}`}
              {assessment.submission.feedback && <p>Feedback: {assessment.submission.feedback}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
*/

// Example 2: Lecturer archive/publish controls
/*
import { 
  archiveAssessment, 
  unarchiveAssessment, 
  publishAssessment, 
  unpublishAssessment 
} from './utils/assessmentManagement';

const LecturerDashboard = () => {
  const handleArchive = async (assessmentId: string) => {
    const result = await archiveAssessment(assessmentId);
    if (result.success) {
      alert(result.message); // "Assessment archived successfully. Students will no longer see this assessment."
      // Refresh assessment list - archived items will disappear from student view immediately
    } else {
      alert(`Error: ${result.error}`);
    }
  };
  
  const handlePublish = async (assessmentId: string) => {
    // Send explicit boolean for intended behavior
    const result = await publishAssessment(assessmentId);
    if (result.success) {
      alert("Assessment published successfully");
    }
  };
  
  const handleUnpublish = async (assessmentId: string) => {
    // Send explicit boolean false to hide from students
    const result = await unpublishAssessment(assessmentId);
    if (result.success) {
      alert("Assessment unpublished - hidden from students");
    }
  };
  
  return (
    <div>
      {assessments.map(assessment => (
        <div key={assessment.id}>
          <h3>{assessment.title}</h3>
          <button onClick={() => handleArchive(assessment.id)}>Archive</button>
          <button onClick={() => handlePublish(assessment.id)}>Publish</button>
          <button onClick={() => handleUnpublish(assessment.id)}>Unpublish</button>
        </div>
      ))}
    </div>
  );
};
*/

// Example 3: Handling course data formats
/*
// Backend now supports both formats:

// Preferred format (array):
const studentDataNew = {
  id: "student123",
  name: "John Doe",
  courses: ["CS101", "MATH201", "ENG102"] // <-- This is preferred
};

// Legacy format (string):
const studentDataLegacy = {
  id: "student123", 
  name: "John Doe",
  course: "CS101" // <-- This is still supported
};

// The frontend automatically detects and sends the appropriate format
*/

export {}; // Make this a module