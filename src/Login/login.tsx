import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await fetch(
        "https://back-user-service.onrender.com/api/v1/back-user-service/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.statusCode !== 200 || !data.data) {
        setError("Login fallido. Credenciales Inválidas.");
        return;
      }

      // Guardar el token y el nombre del usuario en localStorage
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("username", data.data.name); // Aquí guardamos el nombre del usuario

      // Redirigir al dashboard
      navigate("/home");
    } catch (error) {
      console.error("Error:", error);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-card">
          <div className="card auth-card">
            <div className="card-body">
              <h4 className="card-title mb-1">Bienvenido!</h4>
              <p className="card-text mb-2">
                Puedes iniciar sesión en tu cuenta de usuario
              </p>
              {error && <p className="text-danger">{error}</p>}
              <Form className="auth-login-form mt-2" onSubmit={handleLogin}>
                <Form.Group className="mb-1">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-1">
                  <div className="d-flex justify-content-between">
                    <Form.Label>Contraseña</Form.Label>
                    <Link to="/forgot-password">
                      <small>Has olvidado tu contraseña?</small>
                    </Link>
                  </div>
                  <Form.Control
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <div className="mb-1">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? "Iniciando..." : "Iniciar Sesión"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
