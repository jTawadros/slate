import React from "react"
import { auth } from "../firebase"


export default function Account() {
  if (!auth.currentUser){
    return <div>Not logged in... How'd you get here?</div>;
  }
  return(
    <form>
      <div> <h1>Account Page</h1>
      
      <p>{auth.currentUser.email}</p>
      </div>
        <div>
          <h2>Account Settings</h2>
          <button>Change Display Name</button>
          <button>Upload Profile Picture</button>
          <button>Update Password</button>
        </div>

    </form>
  );
}
