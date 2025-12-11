import Model from '../models/contact__contactdata.js';

export const getAll = async (req, res) => {
  try {
    const data = await Model.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Model.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload.data) {
       payload = { data: payload };
    }
    const newData = new Model(payload);
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await Model.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Model.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
