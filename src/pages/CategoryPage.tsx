import { Navigate } from "react-router-dom";

// Categories no longer exist as a separate concept — redirect to home
const CategoryPage = () => {
  return <Navigate to="/" replace />;
};

export default CategoryPage;
