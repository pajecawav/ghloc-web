import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

export const useTheme = () => {
	const ctx = useContext(ThemeContext);

	if (!ctx) {
		throw new Error("Missing ThemeProvider");
	}

	return ctx;
};
