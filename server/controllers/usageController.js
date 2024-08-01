const Usage = require('../models/Usage');

exports.getAllUsage = async (req, res) => {
  try {
    console.log("Fetching all usage data");
    const usage = await Usage.findAll();
    res.json(usage);
  } catch (error) {
    console.error("Error fetching usage data:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.createUsage = async (req, res) => {
  try {
    console.log("Creating usage with data:", req.body);
    const newUsage = await Usage.create(req.body);
    res.status(201).json(newUsage);
  } catch (error) {
    console.error("Error creating usage:", error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.updateUsage = async (req, res) => {
  try {
    console.log("Updating usage with ID:", req.params.id);
    const { date, type, usage } = req.body;
    const [updated] = await Usage.update(
      { date, type, usage },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedUsage = await Usage.findOne({ where: { id: req.params.id } });
      res.json(updatedUsage);
    } else {
      res.status(404).json({ message: 'Usage not found' });
    }
  } catch (error) {
    console.error("Error updating usage:", error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.clearAllUsage = async (req, res) => {
  try {
    console.log("Clearing all usage data");
    await Usage.destroy({ where: {}, truncate: true });
    res.json({ message: 'All usage data cleared' });
  } catch (error) {
    console.error("Error clearing usage data:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUsage = async (req, res) => {
  try {
    console.log("Deleting usage with ID:", req.params.id);
    const deleted = await Usage.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Usage deleted' });
    } else {
      res.status(404).json({ message: 'Usage not found' });
    }
  } catch (error) {
    console.error("Error deleting usage:", error.message);
    res.status(500).json({ message: error.message });
  }
};
