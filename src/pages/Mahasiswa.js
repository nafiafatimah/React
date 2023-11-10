import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem('token');

function Mahasiswa() {
  const [mhs, setMhs] = useState([]);
  const [jrs, setJrsn] = useState([]);
  const [show, setShow] = useState(false);
  const [nama, setNama] = useState("");
  const [nrp, setNrp] = useState("");
  const [id_jurusan, setIdJurusan] = useState("");
  const [gambar, setGambar] = useState(null);
  const [swa_foto, setSwaFoto] = useState(null);
  const [validation, setValidation] = useState({});
  const navigate = useNavigate();
  const url = "http://localhost:3000/static/";

  useEffect(() => {
    fectData();
  }, []);

  const fectData = async () => {
      
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response1 = await axios.get('http://localhost:3000/api/mhs',{headers});
      const response2 = await axios.get('http://localhost:3000/api/jurusan',{headers});
      const data1 = response1.data.data;
      const data2 = response2.data.data;
      setMhs(data1);
      setJrsn(data2);
    } catch (error) {
      // Tangani kesalahan permintaan data
      console.error('Gagal mengambil data:', error);
    }
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    console.log("Modal is closing");
    setShow(false);
  };

  const handleNamaChange = (e) => {
    setNama(e.target.value);
  };

  const handleNrpChange = (e) => {
    setNrp(e.target.value);
  };

  const handleIdJurusanChange = (e) => {
    setIdJurusan(e.target.value);
  };

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    setGambar(file);
  };

  const handleSwaFotoChange = (e) => {
    const file = e.target.files[0];
    setSwaFoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("nama", nama);
    formData.append("nrp", nrp);
    formData.append("id_jurusan", id_jurusan);
    formData.append("gambar", gambar);
    formData.append("swa_foto", swa_foto);

    try {
      await axios.post("http://localhost:3000/api/mhs/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`,
        },
      });
      navigate("/mhs");
      fectData();
    } catch (error) {
      console.error("Kesalahan: ", error);
      setValidation(error.response.data);
    }
  };

  const [editData, setEditData] = useState({
    id: null,
    nama: "",
    nrp: "",
    id_jurusan: "",
    gambar: null,
    swa_foto: null,
  });
  const [showEditModal, setShowEditModal] = useState(false);

  const handleShowEditModal = (data) => {
    setEditData(data);
    setShowEditModal(true);
    setShow(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({
      id: null,
      nama: "",
      nrp: "",
      id_jurusan: "",
      gambar: null,
      swa_foto: null,
    });
  };

  const handleEditDataChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", editData.id);
    formData.append("nama", editData.nama);
    formData.append("nrp", editData.nrp);
    formData.append("id_jurusan", editData.id_jurusan);
    if (editData.gambar) {
      formData.append("gambar", editData.gambar);
    }
    if (editData.swa_foto) {
      formData.append("swa_foto", editData.swa_foto);
    }

    try {
      await axios.patch(`http://localhost:3000/api/mhs/update/${editData.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`,
        },
      });

      navigate("/mhs");
      fectData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
      setValidation(error.response.data);
    }
  };
 
  
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/api/mhs/delete/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        console.log('Data berhasil dihapus');
        // Hapus item dari array data mhs
        const updatedMhs = mhs.filter((item) => item.id !== id);
        setMhs(updatedMhs); // Perbarui state dengan data yang sudah diperbarui
      })
      .catch((error) => {
        console.error('Gagal menghapus data:', error);
        alert('Gagal menghapus data. Silakan coba lagi atau hubungi administrator.');
      });
  };
  
  return (
    <Container>
      <Row>
        <Col>
          <h2>Data Mahasiswa</h2>
          <Button variant="primary" onClick={handleShow}>
            Tambah
          </Button>
        </Col>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Nama</th>
              <th scope="col">NRP</th>
              <th scope="col">Jurusan</th>
              <th scope="col">Gambar</th>
              <th scope="col">Swa Foto</th>
              <th scope="col" colSpan={2}>Action</th> 
            </tr>
          </thead>

          <tbody>
            {mhs.map((mh, index) => (
              <tr key={mh.id}>
                <td>{index + 1}</td>
                <td>{mh.nama}</td>
                <td>{mh.nrp}</td>
                <td>{mh.jurusan}</td>
                <td>
                  <img src={url + mh.gambar} height="100" alt={mh.nama} />
                </td>
                <td>
                  <img src={url + mh.swa_foto} height="100" alt={mh.nama} />
                </td>
                <td>
                  <button onClick={() => handleShowEditModal(mh)} className="btn btn-sm btn-info">
                    Edit
                  </button>
                </td>
                <td> 
                    <button onClick={() => handleDelete(mh.id)} className='btn btn-sm btn-danger' >
                        Hapus
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Row>
      <Row>
        <Table striped bordered hover></Table>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama:</label>
              <input  type="text" className="form-control"  value={nama} onChange={handleNamaChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">NRP:</label>
              <input  type="text"  className="form-control" value={nrp}  onChange={handleNrpChange}  />
            </div>
            <div className="mb-3">
              <label className="form-label">Jurusan:</label>
              <select className="form-select"  value={id_jurusan} onChange={handleIdJurusanChange} >
                {jrs.map((jr) => (
                  <option key={jr.id_j} value={jr.id_j}>
                    {jr.nama_jurusan}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Gambar:</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleGambarChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Swa Foto:</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleSwaFotoChange} />
            </div>
            <button onClick={handleClose} type="submit" className="btn btn-primary">
              Kirim
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Nama:</label>
              <input  type="text" className="form-control"value={editData ? editData.nama : ''} 
               onChange={(e) => handleEditDataChange('nama', e.target.value)}  />
            </div>
            <div className="mb-3">
              <label className="form-label">NRP:</label>
              <input  type="text"  className="form-control" value={editData ? editData.nrp : ''}  
              onChange={(e) => handleEditDataChange('nrp', e.target.value)}  />
            </div>
            <div className="mb-3">
              <label className="form-label">Jurusan:</label>
              <select
                className="form-select"
                value={editData ? editData.id_jurusan : ''}
                onChange={(e) => handleEditDataChange('id_jurusan', e.target.value)} >
                {jrs.map((jr) => (
                  <option key={jr.id_j} value={jr.id_j}>
                    {jr.nama_jurusan}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Gambar:</label>
              <input  type="file"  className="form-control"   accept="image/*"
                onChange={(e) => handleEditDataChange('gambar', e.target.files[0])} />
            </div>
            <div className="mb-3">
              <label className="form-label">Swa Foto:</label>
              <input type="file" className="form-control" accept="image/*"
                onChange={(e) => handleEditDataChange('swa_foto', e.target.files[0])} />
            </div>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Mahasiswa;