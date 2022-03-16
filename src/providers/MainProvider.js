import React from "react";
import DataProvider from "./DataProvider";
import UserProvider from "./UserProvider";

function MainProvider(props) {
    return (
        <UserProvider>
            <DataProvider>
                {props.children}
            </DataProvider>
        </UserProvider>
    )
}

export default MainProvider;