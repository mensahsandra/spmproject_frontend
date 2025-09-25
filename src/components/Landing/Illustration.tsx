import React from "react";

const Illustration: React.FC = () => {
    return (
        <div className="mt-5 text-center">
            <img
                src="/public/assets/illustration.jpg"
                alt="Illustration"
                className="img-fluid"
                style={{ maxWidth: "400px" }}
            />
        </div>
    );
};

export default Illustration;
