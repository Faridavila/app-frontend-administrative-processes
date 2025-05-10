import React from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = (): JSX.Element => {
  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-card">
          <div className="card auth-card">
            <div className="card-body">
              <h4 className="card-title mb-1">Forgot Password? 🛠️</h4>
              <p className="card-text mb-2">
                Enter your email address to reset your password
              </p>

              <Form className="auth-login-form mt-2">
                <Form.Group className="mb-1">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="john@example.com" />
                </Form.Group>

                <div className="mb-1">
                  <Button variant="primary" type="submit" className="w-100">
                    Send Reset Link
                  </Button>
                </div>
              </Form>

              <p className="text-center mt-2">
                <span>Remember your password?</span>
                <Link to="/login">
                  <span>&nbsp;Sign in</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
