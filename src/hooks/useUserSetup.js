import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserData } from "../services/storage";

export const useUserSetup = () => {
  const { user: contextUser } = useAuth();
  const [user, setUser] = useState(null);
  const [setupStatus, setSetupStatus] = useState({
    isFirstLogin: false,
    needsInfoUpdate: false,
    isComplete: false,
    loading: true,
    missingFields: [],
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try to get user from context first
        let currentUser = contextUser;

        // If not available in context, try to get from storage
        if (!currentUser) {
          const storedUser = await getUserData();
          currentUser = storedUser;
        }

        setUser(currentUser);

        if (currentUser) {
          const isFirstLogin =
            !currentUser.name ||
            currentUser.name === null ||
            currentUser.name.trim() === "";

          // Get required fields based on user role
          /* const requiredFields =
            REQUIRED_USER_FIELDS[currentUser.role] ||
            REQUIRED_USER_FIELDS.resident; */

          // Check for missing fields
          /* const missingFields = requiredFields.filter(
            (field) =>
              !currentUser[field] ||
              (typeof currentUser[field] === "string" &&
                currentUser[field].trim() === "") ||
              (field === "apartmentId" &&
                currentUser.role === "resident" &&
                !currentUser[field])
          ); */

          /* const needsInfoUpdate = missingFields.length > 0; */

          setSetupStatus({
            isFirstLogin: false, // Assuming false for now, as we are not checking first login here
            //TODO: Uncomment and implement first login logic if needed
            needsInfoUpdate: false,
            isComplete: !isFirstLogin && !false, // Assuming no missing fields for now
            loading: false,
            missingFields:[],
          });
        } else {
          setSetupStatus({
            isFirstLogin: false,
            needsInfoUpdate: false,
            isComplete: false,
            loading: false,
            missingFields: [],
          });
        }
      } catch (error) {
        console.error("Error in useUserSetup:", error);
        setSetupStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    loadUser();
  }, [contextUser]);

  return { user, ...setupStatus };
};
