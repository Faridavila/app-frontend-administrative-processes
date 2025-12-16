import { useState } from "react";
import { Form, Button, InputGroup, Spinner, Alert } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../API/LoginAPI.tsx";
import "./login.css";

const LoginPage = () => {
  const [username, setUsername] = useState<string>(""); 
  const [password, setPassword] = useState<string>(""); 
  const [showPass, setShowPass] = useState<boolean>(false); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false); 
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await login(username, password);

    if (response && response.statusCode === 200) {
      const {id, token, tokenDateExpired, name, rolName } = response.data;
      localStorage.setItem('userId', id.toString());
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('token_expiry', tokenDateExpired);
      localStorage.setItem('username', name);
      localStorage.setItem('rol',rolName );

      navigate("/dashboard");
    } else {
      setError(response?.message || "Usuario o contraseña incorrectos.");
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recuperando contraseña para:", username);
    setIsForgotPassword(false); 
    setError("Si el correo está registrado, se enviará un enlace para restablecer la contraseña.");
  };

  return (
    <div className="login-shell light-page">
      <aside className="brand-panel d-none d-lg-flex">
        <div className="brand-content">
          <h2 className="brand-title">Ladrillera La Transversal 12</h2>
          <p className="brand-sub">Panel de administración</p>
        </div>
        <svg className="brick-pattern" viewBox="0 0 200 200" preserveAspectRatio="none">
          <defs>
            <pattern id="bricks" width="40" height="20" patternUnits="userSpaceOnUse" patternTransform="translate(0,0)">
              <animateTransform
                attributeName="patternTransform"
                type="translate"
                from="0 0"
                to="40 0"
                dur="3s"
                repeatCount="indefinite"
              />
              <rect width="40" height="20" fill="var(--brick-900)" />
              <rect width="36" height="16" x="2" y="2" rx="2" fill="var(--brick-700)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bricks)" />
        </svg>
      </aside>

      <main className="login-main">
        <div className="login-card glass light">
          <header className="text-center mb-3">
            <h2 className="mb-1">{isForgotPassword ? "Recupera tu contraseña" : "¡Bienvenido!"}</h2>
            <p className="muted">{isForgotPassword ? "Ingresa tu correo electrónico" : "Inicia sesión con tu cuenta de usuario"}</p>
          </header>

          {error && <Alert variant="danger" className="py-2 text-center">{error}</Alert>}

          <Form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin} className="mt-2">
            {isForgotPassword ? (
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Correo Electrónico</Form.Label>
                <InputGroup>
                  <InputGroup.Text aria-hidden>👤</InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Correo Electrónico"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </InputGroup>
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Usuario</Form.Label>
                  <InputGroup>
                    <InputGroup.Text aria-hidden>👤</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-2" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <InputGroup.Text aria-hidden>🔒</InputGroup.Text>
                    <Form.Control
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPass((s) => !s)}
                      type="button"
                      aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                      aria-pressed={showPass}
                      className="d-inline-flex align-items-center justify-content-center px-3"
                    >
                      {showPass ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </>
            )}

            <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
              <Link
                to="#"
                className="forgot-link ms-auto text-nowrap"
                onClick={() => setIsForgotPassword(!isForgotPassword)}  
              >
                {isForgotPassword ? "Iniciar sesión" : "¿Olvidaste tu contraseña?"}
              </Link>
            </div>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? (<><Spinner animation="border" size="sm" className="me-2" /> Iniciando…</>) : isForgotPassword ? "Recuperar contraseña" : "Iniciar sesión"}
            </Button>
          </Form>

          <footer className="mt-4 text-center tiny muted">
            © {new Date().getFullYear()} Ladrillera La Transversal
          </footer>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
