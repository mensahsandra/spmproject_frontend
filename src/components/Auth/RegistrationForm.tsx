import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import endPoint from "../../utils/endpoint";
import { storeUser, setActiveRole, storeToken, storeRefreshToken } from '../../utils/auth';
import { COURSE_CATEGORIES } from '../../utils/courses';

interface FormData {
    name: string;
    honorific?: string;
    email: string;
    password: string;
    role: 'student' | 'lecturer';
    studentId?: string;
    department?: string;
    lecturerId?: string;
    course?: string;         // single course for student
    lecturerCourses?: string[]; // up to 3 for lecturer
}

interface RegistrationFormProps {
    defaultRole: "student" | "lecturer";
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ defaultRole }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        honorific: '',
        email: '',
        password: '',
        role: defaultRole,
        studentId: '',
        department: '',
        lecturerId: '',
        course: '',
        lecturerCourses: []
    });
    const [courseError, setCourseError] = useState<string | null>(null);
        const [courseQuery, setCourseQuery] = useState('');

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'role') {
            // reset course fields when switching roles
            setFormData(prev => ({ ...prev, role: value as any, course: '', lecturerCourses: [] }));
            setCourseError(null);
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const toggleLecturerCourse = (course: string) => {
        setFormData(prev => {
            const exists = prev.lecturerCourses?.includes(course);
            if (exists) {
                return { ...prev, lecturerCourses: prev.lecturerCourses!.filter(c => c !== course) };
            }
            if ((prev.lecturerCourses?.length || 0) >= 3) {
                setCourseError('Lecturers can select up to 3 courses.');
                return prev;
            }
            setCourseError(null);
            return { ...prev, lecturerCourses: [...(prev.lecturerCourses || []), course] };
        });
    };

        const normalizedQuery = courseQuery.trim().toLowerCase();
        const filteredCategories = COURSE_CATEGORIES.map(cat => ({
            category: cat.category,
            courses: cat.courses.filter(c => !normalizedQuery || c.toLowerCase().includes(normalizedQuery))
        })).filter(cat => cat.courses.length > 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true)

                try {
                if (formData.role === 'student') {
                    if (!formData.course) {
                        setCourseError('Please select a course');
                        setLoading(false);
                        return;
                    }
                } else if (formData.role === 'lecturer') {
                    if (!formData.lecturerCourses || formData.lecturerCourses.length === 0) {
                        setCourseError('Select at least one course');
                        setLoading(false);
                        return;
                    }
                }

                const payload: any = {
                    name: formData.name,
                    honorific: formData.honorific,
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password.trim(),
                    role: formData.role,
                };
                if (formData.role === 'student') {
                    payload.studentId = formData.studentId?.trim();
                    payload.course = formData.course; // single
                } else {
                    payload.lecturerId = formData.lecturerId?.trim();
                    payload.courses = formData.lecturerCourses; // array
                }

                console.log('[Registration] Submitting', payload);
                const res = await fetch(`${endPoint}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message || "Registration failed");
            }

            const data = await res.json();
            console.log("Registered:", data);

        // Persist minimal user profile locally for UI personalization (role-aware)
            try {
                const [firstName, ...rest] = (formData.name || '').trim().split(/\s+/);
                const lastName = rest.length ? rest[rest.length - 1] : '';
                const role = formData.role;
                const storedUser = {
                    name: formData.name,
                    firstName,
                    lastName,
                    honorific: formData.honorific || '',
                    email: formData.email,
                    role,
                    studentId: role === 'student' ? formData.studentId : undefined,
                    lecturerId: role === 'lecturer' ? formData.lecturerId : undefined,
            course: role === 'student' ? formData.course : undefined,
            courses: role === 'lecturer' ? formData.lecturerCourses : undefined,
                } as any;
                storeUser(role, storedUser);
                setActiveRole(role);
                if (data.token) storeToken(role, data.token);
                if (data.refreshToken) storeRefreshToken(role, data.refreshToken);
            } catch {}

            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false); // ✅ Stop loading
        }

    };

    return (
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
            <div className="login-header">
                <img 
                    src="/assets/images/KNUST Logo.png" 
                    alt="KNUST Logo" 
                    className="knust-logo-header"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                    onError={(e) => {
                        e.currentTarget.src = "/assets/images/knust-logo.svg";
                    }}
                />
                <h2>Register</h2>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="honorific">Honorific</label>
                <select
                    id="honorific"
                    name="honorific"
                    value={formData.honorific}
                    onChange={handleChange}
                >
                    <option value="">Select honorific</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Rev.">Rev.</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                </select>
            </div>

            {/* Student-specific fields */}
                        {formData.role === 'student' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="studentId">Student ID</label>
                                    <input
                                        type="text"
                                        id="studentId"
                                        name="studentId"
                                        placeholder="Enter your Student ID"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                    />
                                </div>
                                                <div className="form-group">
                                    <label>Course (select one)</label>
                                                    <div style={{display:'flex',gap:8,marginBottom:6}}>
                                                        <input
                                                            type="text"
                                                            placeholder="Search courses..."
                                                            value={courseQuery}
                                                            onChange={e => setCourseQuery(e.target.value)}
                                                            style={{flex:1,padding:'6px 8px'}}
                                                            aria-label="Search courses"
                                                        />
                                                        {courseQuery && <button type="button" onClick={() => setCourseQuery('')} style={{padding:'6px 10px'}}>Clear</button>}
                                                    </div>
                                    <select
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select course</option>
                                                        {filteredCategories.map(cat => (
                                                            <optgroup key={cat.category} label={cat.category}>
                                                                {cat.courses.map(c => <option key={c} value={c}>{c}</option>)}
                                                            </optgroup>
                                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

            {/* Lecturer-specific fields */}
                        {formData.role === 'lecturer' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="lecturerId">Staff ID</label>
                                    <input
                                        type="text"
                                        id="lecturerId"
                                        name="lecturerId"
                                        placeholder="Enter your Staff ID"
                                        value={formData.lecturerId}
                                        onChange={handleChange}
                                    />
                                </div>
                                                                <div className="form-group">
                                                                    <label>Courses</label>
                                                                    <div style={{fontSize:12,color:'#555',marginBottom:4}}>Select up to 3 courses you teach</div>
                                                    <div style={{display:'flex',gap:8,marginBottom:6}}>
                                                        <input
                                                            type="text"
                                                            placeholder="Search courses..."
                                                            value={courseQuery}
                                                            onChange={e => setCourseQuery(e.target.value)}
                                                            style={{flex:1,padding:'6px 8px'}}
                                                            aria-label="Search courses"
                                                        />
                                                        {courseQuery && <button type="button" onClick={() => setCourseQuery('')} style={{padding:'6px 10px'}}>Clear</button>}
                                                    </div>
                                                        <div style={{maxHeight:260,overflowY:'auto',border:'1px solid #ccc',padding:8,borderRadius:4,display:'grid',gap:12}}>
                                                            {filteredCategories.map(cat => (
                                                                <div key={cat.category} style={{minWidth:240}}>
                                                                    <div style={{fontWeight:600,fontSize:12,opacity:.8,marginBottom:4,borderBottom:'1px solid #eee',paddingBottom:2}}>{cat.category}</div>
                                                                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:4}}>
                                                                        {cat.courses.map(c => {
                                                                            const checked = formData.lecturerCourses?.includes(c);
                                                                            return (
                                                                                <label key={c} style={{display:'flex',alignItems:'center',gap:4,fontSize:12,padding:'4px 6px',border:'1px solid #ddd',borderRadius:4,background:checked?'#e6f8f0':'#fafafa',cursor:'pointer'}}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        value={c}
                                                                                        checked={checked}
                                                                                        onChange={() => toggleLecturerCourse(c)}
                                                                                        disabled={!checked && (formData.lecturerCourses?.length||0) >=3}
                                                                                        style={{margin:0}}
                                                                                    />
                                                                                    <span style={{lineHeight:1.2}}>{c}</span>
                                                                                </label>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                </div>
                            </>
                        )}

            {courseError && <div className="alert alert-danger" role="alert">{courseError}</div>}

            <button type="submit" className="sign-in-btn" disabled={loading}>
                {loading && (
                    <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: '8px' }}
                    />
                )}
                {loading ? "Registering..." : "Register"}
            </button>

            <button 
                type="button" 
                className="need-help-btn"
                onClick={() => window.location.href = '/login/student'}
            >
                Already have an account? Login
            </button>
        </form>
    );
};

export default RegistrationForm;
