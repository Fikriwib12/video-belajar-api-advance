const { Op } = require("sequelize");
const Kelas = require("../models/Kelas");
const KategoriKelas = require("../models/KategoriKelas");

exports.getAll = async (req, res) => {
  try {
    const { search, kategori_id, bahasa, sort = "created_at", order = "DESC" } = req.query;

    const where = {};
    if (search) where.judul = { [Op.like]: `%${search}%` };
    if (kategori_id) where.kategori_id = kategori_id;
    if (bahasa) where.bahasa = bahasa;

    const allowedSort = ["judul", "harga", "bahasa", "created_at"];
    const sortField = allowedSort.includes(sort) ? sort : "created_at";
    const sortOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const kelas = await Kelas.findAll({
      where,
      include: [
        {
          model: KategoriKelas,
          as: "kategori",
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [[sortField, sortOrder]],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data kelas",
      data: kelas,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const kelas = await Kelas.findByPk(id, {
      include: [
        {
          model: KategoriKelas,
          as: "kategori",
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data kelas",
      data: kelas,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { kategori_id, judul, deskripsi, thumbnail, harga, bahasa } =
      req.body;

    if (!judul) {
      return res.status(400).json({ message: "judul harus diisi" });
    }
    if (!kategori_id) {
      return res.status(400).json({ message: "kategori  harus diisi" });
    }
    const kategori = await KategoriKelas.findByPk(kategori_id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    const slug = judul.toLowerCase().replace(/ /g, "-");
    const existing = await Kelas.findOne({ where: { slug } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "kelas Ini sudah ada sebelumnya" });
    }

    const kelas = await Kelas.create({
      kategori_id,
      judul,
      slug,
      deskripsi,
      thumbnail,
      harga,
      bahasa,
    });

    return res.status(201).json({
      message: "Kelas berhasil dibuat",
      data: kelas,
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
    const { kategori_id, judul, deskripsi, thumbnail, harga, bahasa } =
      req.body;

    const kelas = await Kelas.findByPk(id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }
    if (kategori_id) {
      const kategori = await KategoriKelas.findByPk(kategori_id);
      if (!kategori) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }
    }
    let slug = kelas.slug;
    if (judul && judul !== kelas.judul) {
      slug = judul.toLowerCase().replace(/ /g, "-");
      const existing = await Kelas.findOne({ where: { slug } });
      if (existing && existing.id !== kelas.id) {
        return res
          .status(409)
          .json({ message: "Kelas dengan judul ini sudah ada" });
      }
    }

    await kelas.update({
      kategori_id: kategori_id ?? kelas.kategori_id,
      judul: judul ?? kelas.judul,
      slug,
      deskripsi: deskripsi ?? kelas.deskripsi,
      thumbnail: thumbnail ?? kelas.thumbnail,
      harga: harga ?? kelas.harga,
      bahasa: bahasa ?? kelas.bahasa,
    });

    return res.status(200).json({
      message: "Kelas berhasil diupdate",
      data: kelas,
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

    const kelas = await Kelas.findByPk(id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    await kelas.destroy(); // soft delete karena paranoid: true

    return res.status(200).json({
      message: "Kelas berhasil dihapus",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
