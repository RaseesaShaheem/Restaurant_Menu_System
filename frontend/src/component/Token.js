// import React, { createContext, useState, useEffect } from "react";

// export const TokenContext = createContext();

// export const TokenProvider = ({ children }) => {
//     const [token, setToken] = useState(localStorage.getItem("token"));

//     useEffect(() => {
//         if (!token) {
//             fetch("/api/create-token/")
//                 .then((response) => response.json())
//                 .then((data) => {
//                     setToken(data.token);
//                     lcalStorage.setItem("token", data.token);
//                 });
//         }
//     }, [token]);

//     return (
//         <TokenContext.Provider value={token}>
//             {children}
//         </TokenContext.Provider>
//     );
// };