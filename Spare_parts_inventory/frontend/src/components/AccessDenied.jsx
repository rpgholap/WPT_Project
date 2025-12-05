import { useNavigate } from "react-router-dom";

export function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="display-4 text-danger mb-3">Access Denied</h1>
      <p className="text-muted mb-4">You do not have permission to view this page.</p>
      <button className="btn btn-danger fw-semibold" onClick={() => navigate("/")}>
        Go Back Home
      </button>
    </div>
  );
}