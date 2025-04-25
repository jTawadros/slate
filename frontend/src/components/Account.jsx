import React from "react"
import { auth } from "../firebase"


export default function Account() {

  return(
    <div>Account Page
    
    <h1>{auth.currentUser.email}</h1>
    </div>
  );
}
