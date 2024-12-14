const mysql = require("mysql2/promise");
const dbConfig = require("../configs/database"); // Memastikan koneksi database menggunakan pool
const pool = mysql.createPool(dbConfig);

module.exports = {
  // Fungsi untuk mengambil data Todos
  async getTodos(req, res) {
    try {
      const [results] = await pool.execute("SELECT * FROM todos;");
      res.render("todos", {
        url: "http://localhost:5000/",
        todos: results.length > 0 ? results : [],
      });
    } catch (err) {
      console.error("Error saat query:", err);
      res.status(500).send("Gagal mengambil data Todos");
    }
  },

  // Fungsi untuk menyimpan data Todos
  async saveTodos(req, res) {
    const { name, jenis, harga } = req.body; // Mengambil data dari body request
  
    // Memeriksa apakah semua data ada dan harga adalah angka
    if (name && jenis && harga && !isNaN(harga)) {
      try {
        // Menyimpan data ke dalam database
        await pool.execute(
          "INSERT INTO todos (name, jenis, harga) VALUES (?, ?, ?);",
          [name, jenis, harga]
        );
  
        // Menyimpan flash message untuk notifikasi
        req.flash("color", "success");
        req.flash("status", "Yes..");
        req.flash("message", "Data berhasil disimpan");
  
        // Redirect ke halaman todos setelah data disimpan
        res.redirect("/todos");
      } catch (err) {
        // Menangani error jika terjadi kesalahan saat menyimpan data
        console.error("Error saat menyimpan data:", err);
        req.flash("color", "danger");
        req.flash("status", "Oops..");
        req.flash("message", "Gagal menyimpan data, coba lagi.");
        res.redirect("/todos"); // Redirect ke halaman todos jika error
      }
    } else {
      // Jika ada data yang kosong atau harga bukan angka
      req.flash("color", "danger");
      req.flash("status", "Oops..");
      req.flash("message", "Data tidak lengkap atau harga tidak valid");
      res.redirect("/todos"); // Redirect kembali ke halaman todos
    }
  },
  

  // Fungsi untuk memperbarui data Todos
  async updateTodos(req, res) {
    const { id } = req.params;
    const { name, jenis, harga } = req.body; // Ganti nama menjadi name
    try {
      await pool.execute(
        "UPDATE todos SET name = ?, jenis = ?, harga = ? WHERE id = ?", // Ganti nama menjadi name
        [name, jenis, harga, id]
      );
      res.redirect("/todos");
    } catch (err) {
      console.error("Error saat memperbarui data:", err);
      res.send("Gagal memperbarui data");
    }
  },

  // Fungsi untuk menghapus data Todos
  async deleteTodos(req, res) {
    const { id } = req.params;
    try {
      await pool.execute("DELETE FROM todos WHERE id = ?", [id]);
      res.redirect("/todos");
    } catch (err) {
      console.error("Error saat menghapus data:", err);
      res.send("Gagal menghapus data");
    }
  },

  // Fungsi untuk menampilkan halaman edit Todos
  async editTodos(req, res) {
    const { id } = req.params;
    try {
      const [results] = await pool.execute("SELECT * FROM todos WHERE id = ?", [
        id,
      ]);
      res.render("edit-todos", { todos: results[0] });
    } catch (err) {
      console.error("Error saat mengambil data untuk edit:", err);
      res.send("Gagal mengambil data Todos");
    }
  },
};
