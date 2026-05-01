const KategoriKelas = require("../models/KategoriKelas");

exports.getAll = async (req, res) => {
  try {
    const kategori = await KategoriKelas.findAll();

    return res.status(200).json({
      message: "Data Kategori Kelas Berhasil Diambil",
      data: kategori,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) {
      return res.status(401).json({ message: "Nama Belum di isi" });
    }

    //ini buat slug otomatis dari nama kategori
    const slug = name.toLowerCase().replace(/ /g, "-");

    const existing = await KategoriKelas.findOne({ where: { slug } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Kategori Ini sudah ada sebelumnya" });
    }
    const kategori = await KategoriKelas.create({ name, slug, icon });
    return res.status(201).json({
      message: "Kategori berhasil dibuat",
      data: kategori,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    const kategori = await KategoriKelas.findByPk(id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    let slug = kategori.slug;
    if (name && name !== kategori.name) {
      slug = name.toLowerCase().replace(/ /g, "-");
      const existing = await KategoriKelas.findOne({ where: { slug } });
      if (existing && existing.id !== kategori.id) {
        return res
          .status(409)
          .json({ message: "Kategori dengan nama ini sudah ada" });
      }
    }

    await kategori.update({
      name: name ?? kategori.name,
      slug,
      icon: icon ?? kategori.icon,
    });

    return res.status(200).json({
      message: "Kategori berhasil diupdate",
      data: kategori,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await KategoriKelas.findByPk(id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    await kategori.destroy();

    return res.status(200).json({
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
