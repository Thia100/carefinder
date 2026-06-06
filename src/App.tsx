import { Route, Routes } from "react-router-dom"
import { HospitalDetails } from "./pages/HospitalDetails"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"

import { Toaster } from "sonner"

function App() {

  return (
    <>
     <Toaster />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/hospital/:id" element={<HospitalDetails />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<SignUp />}/>
        </Routes>
    </>
  )
}

export default App
