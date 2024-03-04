// useSessions.ts
import { useState } from "react";

export const useSessions = () => {
    const initialUserName = sessionStorage.getItem('userName');
    const [loggedUser, setLoggedUser] = useState<string | null>(initialUserName);

    return { loggedUser };
};
