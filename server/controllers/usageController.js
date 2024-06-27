const Usage = require('../models/Usage');

exports.getAllUsage = async (req, res) => {
  try {
    const usage = await Usage.findAll();
    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUsage = async (req, res) => {
  try {
    const { date, type, usage } = req.body;
    const newUsage = await Usage.create({ date, type, usage });
    res.status(201).json(newUsage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUsage = async (req, res) => {
  try {
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
    res.status(400).json({ message: error.message });
  }
};

exports.clearAllUsage = async (req, res) => {
  try {
    await Usage.destroy({ where: {}, truncate: true });
    res.json({ message: 'All usage data cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUsage = async (req, res) => {
  try {
    const deleted = await Usage.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Usage deleted' });
    } else {
      res.status(404).json({ message: 'Usage not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
