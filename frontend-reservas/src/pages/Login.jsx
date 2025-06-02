import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import logoUdala from '../assets/logoUdala.png'; // Asegúrate que la ruta esté bien

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/usuarios/login',
        { correo, contrasena },
        { withCredentials: true } // 👈 IMPORTANTE: para mandar cookies de sesión
      );

      console.log('Respuesta del servidor:', response.data);

      const usuario = response.data;
      localStorage.setItem('usuario', JSON.stringify(usuario));

      if (usuario.rol === 'ADMIN') {
        navigate('/'); // Puedes ajustar si quieres
      } else if (usuario.rol === 'USUARIO') {
        navigate('/usuario-dashboard'); // Lleva a UsuarioDashboard.jsx
      } else {
        setError('Rol no reconocido.');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setError('Correo o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Card.Body>
          <div className="text-center">
            <img src={logoUdala} alt="Logo Udala" className="login-logo" />
            <h2 className="login-title">Ongi Etorri · Bienvenido</h2>
          </div>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo (usuario)</Form.Label>
              <Form.Control
                type="email"
                placeholder="Introduce tu correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Introduce tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 login-button"
              disabled={cargando}
            >
              {cargando ? <Spinner animation="border" size="sm" /> : 'Entrar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
