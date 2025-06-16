import WebContact from "../models/WebContact.js";

const getWebContact = async (req, res) => {
  try {
    const webContact = await WebContact.find();
    res.status(200).json({
      message: "All webContact fetched successfully",
      data: webContact,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const addWebContact = async (req, res) => {
  try {
    const {
      whatsApp,
      email,
      phoneOne,
      phoneTwo,
      phoneThree,
      address,
      facebook,
      youtube,
      instagram,
      linkedin,
      twitter,
    } = req.body;
    const webContact = new WebContact({
      whatsApp,
      email,
      phoneOne,
      phoneTwo,
      phoneThree,
      address,
      facebook,
      youtube,
      instagram,
      linkedin,
      twitter,
    });
    await webContact.save();
    res.status(200).json({
      message: "webContact created successfully",
      data: webContact,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateWebContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updateWebContactData = req.body;
    const webContact = await WebContact.findOneAndUpdate(
      { _id: id },
      updateWebContactData,
      { new: true }
    );
    if (!webContact) {
      return res.status(404).json({
        message: "webContact not found",
        data: null,
        error: null,
      });
    }
    res.status(200).json({
      message: "webContact updated successfully",
      data: webContact,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { getWebContact, addWebContact, updateWebContact };