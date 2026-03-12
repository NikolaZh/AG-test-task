import { useContext } from "react";
import { AuthContext } from "../features/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth