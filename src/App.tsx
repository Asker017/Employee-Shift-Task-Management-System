import Router from "./Routes/Router"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <div className="h-screen">
      <Router />
      <Toaster />
    </div>
  )
}

export default App
