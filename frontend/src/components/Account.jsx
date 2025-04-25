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
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Change Display Name</button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Upload Profile Picture</button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Password</button>
        </div>

    </form>
  );
}
