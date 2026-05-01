const Tutor = require("../models/Tutor");
const User = require("../models/User");

exports.getAll = async (req, res) => {
  try {
    const tutors = await Tutor.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data tutor",
      data: tutors,
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

    const tutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data tutor",
      data: tutor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { user_id, nama, foto, jabatan, perusahaan, bio } = req.body;

    if (!nama) {
      return res.status(400).json({ message: "Nama wajib diisi" });
    }

    if (user_id) {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
    }

    const tutor = await Tutor.create({
      user_id,
      nama,
      foto,
      jabatan,
      perusahaan,
      bio,
    });

    return res.status(201).json({
      message: "Tutor berhasil dibuat",
      data: tutor,
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
    const { user_id, nama, foto, jabatan, perusahaan, bio } = req.body;

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor tidak ditemukan" });
    }

    if (user_id) {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
    }

    await tutor.update({
      user_id: user_id ?? tutor.user_id,
      nama: nama ?? tutor.nama,
      foto: foto ?? tutor.foto,
      jabatan: jabatan ?? tutor.jabatan,
      perusahaan: perusahaan ?? tutor.perusahaan,
      bio: bio ?? tutor.bio,
    });

    return res.status(200).json({
      message: "Tutor berhasil diupdate",
      data: tutor,
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

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor tidak ditemukan" });
    }

    await tutor.destroy();

    return res.status(200).json({
      message: "Tutor berhasil dihapus",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
