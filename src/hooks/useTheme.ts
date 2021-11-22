import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

export const useTheme = () => {
	return useContext(ThemeContext);
};
