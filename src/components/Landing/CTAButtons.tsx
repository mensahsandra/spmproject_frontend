import React from "react";

const CTAButtons: React.FC = () => {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
            <a
                href="#"
                className="btn btn-primary btn-lg px-4 py-2 rounded"
            >
                I'm a Student
            </a>
            <a
                href="#"
                className="btn btn-dark btn-lg px-4 py-2 rounded"
            >
                I'm a Lecturer
            </a>
        </div>
    );
};

export default CTAButtons;
