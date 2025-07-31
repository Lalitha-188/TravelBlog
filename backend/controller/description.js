const Description=require("../models/description")
const multer = require("multer")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname
    cb(null,filename)
  }
})

const upload = multer({ storage: storage })


const getDescriptions=async(req,res)=>{
    const descriptions=await Description.find().populate("createdBy")
    return res.json(descriptions)
}

const getDescription = async (req, res) => {
  try {
    const description = await Description.findById(req.params.id).populate("createdBy");

    if (!description) {
      return res.status(404).json({ message: "Description not found" });
    }

    res.json(description);
  } catch (error) {
    console.error("Error fetching description by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addDescription = async (req, res) => {

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  console.log("USER:", req.user);

  const { title, itenary, tales, days } = req.body;
  const filename = req.file?.filename;

  if (!title || !itenary || !tales || !days || !filename) {
    return res.status(400).json({ error: "All fields including file are required" });
  }

  if (!req.user || !(req.user._id || req.user.id)) {
    return res.status(401).json({ error: "Unauthorized - user not found" });
  }

  try {
    const newDescription = new Description({
      title,
      itenary: typeof itenary === 'string' ? itenary.split(",") : itenary,
      tales,
      days,
      file: filename,
      createdBy: req.user._id,
    });

    await newDescription.save();
    res.status(201).json(newDescription);
  } catch (error) {
    console.error("Error adding description:", error);
    res.status(500).json({ error: "Failed to add description" });
  }
};



const editDescription = async (req, res) => {
  const { title, itenary, tales, days } = req.body;

  try {
    const description = await Description.findById(req.params.id);

    if (!description) {
      return res.status(404).json({ msg: "Description not found" });
    }

    const updatedFile = req.file?.filename || description.file;

    const updatedDescription = await Description.findByIdAndUpdate(
      req.params.id,
      {
        title,
        itenary: typeof itenary === 'string' ? itenary.split(",") : itenary, // ensure array
        tales,
        days,
        file: updatedFile,
      },
      { new: true }
    );

    res.json(updatedDescription);
  } catch (err) {
    console.error("Edit description error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


const deleteDescription = async (req, res) => {
  try {
    const description = await Description.findById(req.params.id);
    if (!description) {
      return res.status(404).json({ message: "Description not found" });
    }


    await Description.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Description deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports={getDescriptions,getDescription,addDescription,editDescription,deleteDescription,upload}