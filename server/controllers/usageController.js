const { Usage } = require('../models');

exports.createUsage = async (req, res) => {
  try {
    const { date, type, amount } = req.body;
    const userId = req.body.userId || 1;  // Replace 1 with actual logic to get the user ID, if needed

    console.log("Creating usage with data:", { date, type, amount, userId });

    const newUsage = await Usage.create({ date, type, amount, userId });
    res.status(201).json(newUsage);
  } catch (error) {
    console.error("Error creating usage:", error);  // Log full error
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsage = async (req, res) => {
  try {
    const usageData = await Usage.findAll();
    res.json(usageData);
  } catch (error) {
    console.error("Error fetching usage data:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUsage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating usage with ID:", id, "with data:", req.body);
    
    const updatedUsage = await Usage.update(req.body, { where: { id } });

    if (updatedUsage[0] === 0) {
      res.status(404).json({ message: 'Usage not found' });
    } else {
      const refreshedUsage = await Usage.findOne({ where: { id } });
      res.json(refreshedUsage);
    }
  } catch (error) {
    console.error("Error updating usage:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.clearAllUsage = async (req, res) => {
  try {
    await Usage.destroy({ where: {}, truncate: true });
    res.json({ message: 'All usage data cleared' });
  } catch (error) {
    console.error("Error clearing usage data:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUsage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting usage with ID:", id);

    const deleted = await Usage.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Usage deleted' });
    } else {
      res.status(404).json({ message: 'Usage not found' });
    }
  } catch (error) {
    console.error("Error deleting usage:", error);
    res.status(500).json({ message: error.message });
  }
};
