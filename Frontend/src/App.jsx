import { useState, useEffect } from 'react'
import './App.css'
const API_URL = import.meta.env.VITE_API_URL
const NAVIGATION_EVENT = 'pushstate'

function navigate (href) {
  window.history.pushState({}, '', href)
  const navigationEvent = new Event(NAVIGATION_EVENT)
  window.dispatchEvent(navigationEvent)
}

function SessionPage( { LoginSuccess, session, Logout } ){
  const [loginMsg, setLoginMsg] = useState("")
  const [registerMsg, setRegisterMsg] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/session/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', 
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setLoginMsg("Sesión iniciada... Entrando...");
      setTimeout(() => LoginSuccess(), 2000);
    } else {
      const error = await res.json()
      setLoginMsg(error.message);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirm = e.target["confirm-password"].value;

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/session/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', 
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setRegisterMsg("Usuario registrado. Entrando...");
      setTimeout(() => LoginSuccess(), 2000);
    } else {
      const error = await res.json()
      setRegisterMsg(error.message);
    }
  };
  return (
    <>
      {session !== null && <div>
      <h2>holaa {session}</h2>
      <p>ya tienes una sesion iniciada</p>
      <button onClick={Logout}>Cerrar sesión</button>
      <button onClick={LoginSuccess}>Entrar</button>
    </div>}
      {session === null && 
      <div className="form-container">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <label>Username</label>
          <input type="text" name="username" required />

          <label>Password</label>
          <input type="password" name="password" required />

          <button type="submit">Login</button>
          <span>{loginMsg}</span>
        </form>
      </div>}

      <div className="form-container">
        <form onSubmit={handleRegister}>
          <h2>Register</h2>

          <label>Username</label>
          <input type="text" name="username" required />

          <label>Password</label>
          <input type="password" name="password" required />

          <label>Confirm Password</label>
          <input type="password" name="confirm-password" required />

          <button type="submit">Register</button>
          <span>{registerMsg}</span>
        </form>
      </div>
    </>
  )
}

function ProtectedPage({ Logout, Login, session }) {
  if(session !== null){
    return (
    <div>
      <h2>holaa</h2>
      <p>Estás en el panel de Administración</p>
      <button onClick={Logout}>Cerrar sesión</button>
    </div>
    );
  } else {
    return (
    <div>
      <h2>holaa</h2>
      <p>Para entrar al panel de adminstracion debes iniciar sesion</p>
      <button onClick={Login}>Iniciar Session</button>
    </div>
    );
  }

  
}
function HomePage({ session }) {
  if (session !==  null){
    navigate('/protected')
  } else {
    navigate('/login')
  }
}

export function App () {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [currentSession, setCurrentSesion] = useState()
  

  
  const fetchSesion = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/checkSesion`, {
        method: "GET",
        credentials: "include" 
      })
      if (response.ok){
        const data = await response.json()
        setCurrentSesion(data.username)
      } else {
        setCurrentSesion(null)
      }
  }

  useEffect(() => {
    fetchSesion()
  }, [])

  const fetchCloseSession = async () =>{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      credentials: 'include', 
    });
    if (res.ok) {
      const data = await res.json()
      console.log(data.message); 
      setTimeout(() => navigate('/login'), 1000);
    }else {
      
    }
  }


  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname)
      fetchSesion()
    }

    window.addEventListener(NAVIGATION_EVENT, onLocationChange)
    window.addEventListener('popstate', onLocationChange)

    return () => {
      window.removeEventListener(NAVIGATION_EVENT, onLocationChange)
      window.removeEventListener('popstate', onLocationChange)
    }
  }, [])


  return (

   <main>
    {currentPath === '/' && <HomePage session={currentSession}/> },
    {currentPath === '/login' && <SessionPage LoginSuccess={() => navigate('/protected')} session={currentSession} Logout={() => fetchCloseSession()}/> }
    
    {currentPath === '/protected' && <ProtectedPage Logout={() => fetchCloseSession()} Login={() => navigate('/login')} session={currentSession} />}
   </main>
  )
}
