import { useNavigation } from "@react-navigation/native";

export const useAuthNavigation = () => {
  const navigation = useNavigation();

  const navigateBasedOnRole = (role) => {
    if (role === "admin") {
      navigation.reset({
        index: 0,
        routes: [{ name: "AdminDashboard" }],
      });
    } else if (role === "resident") {
      navigation.reset({
        index: 0,
        routes: [{ name: "ResidentDashboard" }],
      });
    } else {
      console.error("Invalid role:", role);
    }
  };

  const navigateToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return {
    navigateBasedOnRole,
    navigateToLogin,
  };
};
