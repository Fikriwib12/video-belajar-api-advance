exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File gambar wajib diupload" });
  }

  const fileUrl = `${process.env.APP_URL}/uploads/${req.file.filename}`;

  return res.status(200).json({
    message: "Upload berhasil",
    data: {
      filename: req.file.filename,
      url: fileUrl,
    },
  });
};
