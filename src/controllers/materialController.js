const Material = require("../models/Material");
const ModulKelas = require("../models/ModulKelas");

exports.getAll = async (req, res) => {
  try {
    const materials = await Material.findAll({
      include: [
        {
          model: ModulKelas,
          as: "modul",
          attributes: ["id", "judul", "urutan"],
        },
      ],
      order: [["urutan", "ASC"]],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data material",
      data: materials,
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

    const material = await Material.findByPk(id, {
      include: [
        {
          model: ModulKelas,
          as: "modul",
          attributes: ["id", "judul", "urutan"],
        },
      ],
    });

    if (!material) {
      return res.status(404).json({ message: "Material tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data material",
      data: material,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { modul_id, judul, tipe, konten, file_url, durasi_menit, urutan } =
      req.body;

    if (!modul_id || !judul) {
      return res
        .status(400)
        .json({ message: "modul_id dan judul wajib diisi" });
    }

    const modul = await ModulKelas.findByPk(modul_id);
    if (!modul) {
      return res.status(404).json({ message: "Modul tidak ditemukan" });
    }

    const material = await Material.create({
      modul_id,
      judul,
      tipe,
      konten,
      file_url,
      durasi_menit,
      urutan,
    });

    return res.status(201).json({
      message: "Material berhasil dibuat",
      data: material,
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
    const { modul_id, judul, tipe, konten, file_url, durasi_menit, urutan } =
      req.body;

    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({ message: "Material tidak ditemukan" });
    }

    if (modul_id) {
      const modul = await ModulKelas.findByPk(modul_id);
      if (!modul) {
        return res.status(404).json({ message: "Modul tidak ditemukan" });
      }
    }

    await material.update({
      modul_id: modul_id ?? material.modul_id,
      judul: judul ?? material.judul,
      tipe: tipe ?? material.tipe,
      konten: konten ?? material.konten,
      file_url: file_url ?? material.file_url,
      durasi_menit: durasi_menit ?? material.durasi_menit,
      urutan: urutan ?? material.urutan,
    });

    return res.status(200).json({
      message: "Material berhasil diupdate",
      data: material,
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

    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({ message: "Material tidak ditemukan" });
    }

    await material.destroy();

    return res.status(200).json({
      message: "Material berhasil dihapus",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
