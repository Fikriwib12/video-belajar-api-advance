const Review = require("../models/Review");
const User = require("../models/User");
const Kelas = require("../models/Kelas");
const KelasSaya = require("../models/KelasSaya");

const includeRelasi = [
  {
    model: User,
    as: "user",
    attributes: ["id", "name", "avatar"],
  },
  {
    model: Kelas,
    as: "kelas",
    attributes: ["id", "judul", "slug"],
  },
];

exports.getAll = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: includeRelasi,
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data review",
      data: reviews,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.getByKelas = async (req, res) => {
  try {
    const { kelas_id } = req.params;

    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    const reviews = await Review.findAll({
      where: { kelas_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const rataRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return res.status(200).json({
      message: "Berhasil mengambil review kelas",
      rata_rating: parseFloat(rataRating.toFixed(1)),
      total_review: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { user_id, kelas_id, rating, komentar } = req.body;

    if (!user_id || !kelas_id || !rating) {
      return res
        .status(400)
        .json({ message: "user_id, kelas_id, dan rating wajib diisi" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating harus antara 1 sampai 5" });
    }

    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    const sudahEnroll = await KelasSaya.findOne({ where: { user_id, kelas_id } });
    if (!sudahEnroll) {
      return res
        .status(403)
        .json({ message: "Anda harus enroll kelas ini sebelum memberikan review" });
    }

    const sudahReview = await Review.findOne({ where: { user_id, kelas_id } });
    if (sudahReview) {
      return res
        .status(409)
        .json({ message: "Anda sudah memberikan review untuk kelas ini" });
    }

    const review = await Review.create({ user_id, kelas_id, rating, komentar });

    return res.status(201).json({
      message: "Review berhasil dikirim",
      data: review,
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
    const { rating, komentar } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating harus antara 1 sampai 5" });
    }

    await review.update({
      rating: rating ?? review.rating,
      komentar: komentar ?? review.komentar,
    });

    return res.status(200).json({
      message: "Review berhasil diupdate",
      data: review,
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

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    await review.destroy();

    return res.status(200).json({
      message: "Review berhasil dihapus",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
