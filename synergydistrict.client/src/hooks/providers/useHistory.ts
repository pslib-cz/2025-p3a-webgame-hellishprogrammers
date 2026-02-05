import { useContext } from "react";
import { HistoryContext } from "../../provider/HistoryProvider";

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) throw new Error("useHistory must be used within HistoryProvider");
    return context;
};
