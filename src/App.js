import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';
import { Container, Form, Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';

const CDNURL = "https://dbciokfvdyaxbryvjmfz.supabase.co/storage/v1/object/public/images/";

function App() {
  const [email, setEmail] = useState("");
  const [images, setImages] = useState([]);
  const [renameInput, setRenameInput] = useState("");
  const user = useUser();
  const supabase = useSupabaseClient();

  async function getImages() {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setImages(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  async function magicLinkLogin() {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert("Kesalahan komunikasi dengan supabase, pastikan menggunakan alamat email asli!");
      console.log(error);
    } else {
      alert("Periksa email Anda untuk Akses Link login!");
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  async function uploadImage(e) {
    let file = e.target.files[0];
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(user.id + "/" + uuidv4(), file);

    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  }

  async function deleteImage(imageName) {
    const { error } = await supabase.storage.from('images').remove([user.id + "/" + imageName]);
    if (error) {
      alert(error);
    } else {
      getImages();
    }
  }

  async function renameImage(oldName, newName) {
    const { error } = await supabase.storage
      .from('images')
      .move(user.id + "/" + oldName, user.id + "/" + newName);

    if (error) {
      alert("Kesalahan saat mengganti nama file: " + error.message);
    } else {
      alert("File berhasil di rename!");
      getImages();
    }
  }

  async function downloadImage(imageName) {
    const { data, error } = await supabase.storage
      .from('images')
      .download(user.id + "/" + imageName);

    if (data) {
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert("Kesalahan saat mengunduh file: " + error.message);
    }
  }

  return (
    <Container align="center" className="container-sm mt-4">
      {user === null ? (
        <>
          <img className="mb-3" src="/images/a11.gif" alt="Welcome GIF" style={{ width: '300px', height: 'auto' }} />
          <h1>+ Selamat Datang Di GambarSave +</h1>
          <Form>
            <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
              <Form.Label className="mb-3">Masukkan email anda untuk sign in ke Layanan ini ++┏( ￣▽￣)┛</Form.Label>
              <Form.Control
                type="email"
                placeholder="contoh@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="info" onClick={() => magicLinkLogin()}>
              Get Link
            </Button>
          </Form>
        </>
      )
        :
        (
          <>
            <h1 className="mb-3">+ GambarSave +</h1>
            <p>User saat ini: {user.email}</p>
            <Button variant="danger" className="mb-3" onClick={() => signOut()}>Sign Out</Button>
            <p>Tekan button Pilih File di bawah untuk mengunggah gambar ke galeri Anda</p>
            <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
              <Form.Control
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => uploadImage(e)}
              />
            </Form.Group>
            <hr />
            <h3 className="mb-2">-  Galeri Anda -</h3>
            <Row xs={1} md={3} className="g-4">
              {images.map((image) => (
                <Col key={CDNURL + user.id + "/" + image.name}>
                  <Card>
                    <Card.Img variant="top" src={CDNURL + user.id + "/" + image.name} />
                    <Card.Body>
                      <Card.Title>{image.name}</Card.Title>
                      <InputGroup className="mb-3">
                        <FormControl
                          placeholder="Rename file"
                          onChange={(e) => setRenameInput(e.target.value)}
                        />
                        <Button
                          variant="warning"
                          onClick={() => renameImage(image.name, renameInput)}
                        >
                          Rename
                        </Button>
                      </InputGroup>
                      <Button
                        variant="info"
                        className="me-2"
                        onClick={() => downloadImage(image.name)}
                      >
                        Download
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => deleteImage(image.name)}
                      >
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
    </Container>
  );
}

export default App;
