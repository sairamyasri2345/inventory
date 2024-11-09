const express = require('express');
const router = express.Router();
const AppliedProduct = require('../models/appliedProduct');
const Product = require('../models/product');
const nodemailer = require('nodemailer');

const Employee=require("../models/employeeData")
// Apply a product
router.post('/apply', async (req, res) => {
  try {
    const { employeeID, employeeName, productID, quantity, date } = req.body;
    const product = await Product.findById(productID);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const appliedProduct = new AppliedProduct({
      employeeID,
      employeeName,
      productID,
      productName: product.name,
      quantity,
      date
    });
    await appliedProduct.save();
    res.status(201).json(appliedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch applied products for a specific employee
router.get('/:employeeID', async (req, res) => {
  try {
    const { employeeID } = req.params;
    const appliedProducts = await AppliedProduct.find({ employeeID });
    res.json(appliedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/apply/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, date } = req.body;
    const updatedProduct = await AppliedProduct.findByIdAndUpdate(
      id,
      { quantity, date },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Applied product not found' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete('/apply/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await AppliedProduct.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: 'Applied product not found' });
    res.json({ message: 'Applied product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// router.get('/all', async (req, res) => {
//   try {
//     const appliedProducts = await AppliedProduct.find();
//     res.status(200).json(appliedProducts);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching applied products", error: error.message });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const appliedProducts = await AppliedProduct.find()

    res.status(200).json(appliedProducts);
  } catch (error) {
    console.error('Error fetching applied products:', error);
    res.status(500).json({ message: 'Server error. Unable to fetch applied products.' });
  }
});



// Update product status
// router.put('/update-status/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const appliedProduct = await AppliedProduct.findByIdAndUpdate(id, { status }, { new: true });
//     if (!appliedProduct) return res.status(404).json({ message: 'Applied product not found' });

//     // Send email notification (assuming you have a sendEmail utility)
//     sendEmail(appliedProduct.employeeEmail, `Your application status for ${appliedProduct.productName} has been updated to ${status}`);

//     res.json(appliedProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.put('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // New status value (approved, pending, not available)

    // Update the status of the applied product in the database
    const appliedProduct = await AppliedProduct.findByIdAndUpdate(id, { status }, { new: true });
    if (!appliedProduct) {
      return res.status(404).json({ message: 'Applied product not found' });
    }

    // Compose the email message based on the new status
    let emailMessage = '';
    switch (status) {
      case 'approved':
        emailMessage = `Congratulations! Your application for the product "${appliedProduct.productName}" has been approved.`;
        break;
      case 'not available':
        emailMessage = `We regret to inform you that the product "${appliedProduct.productName}" you applied for is currently not available.`;
        break;
      case 'pending':
        emailMessage = `Your application for the product "${appliedProduct.productName}" is still pending. Please check back later for updates.`;
        break;
      default:
        emailMessage = `The status of your product application has been updated.`;
        break;
    }

    // Send email notification to the employee
    await sendEmail(Employee.email, emailMessage);

    res.json({ message: 'Status updated and email sent', appliedProduct });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: error.message });
  }
});

// Function to send email
const sendEmail = (to, message) => {
  const transporter = nodemailer.createTransport({

     host: 'smtp.atmoslifestyle.com', 
  port: 587, // Use the appropriate port (587 for TLS, 465 for SSL)
  secure: false,
    auth: {
      user: 'admin@atmoslifestyle.com',
      pass: 'Atmos',
    },
  });

  const mailOptions = {
    from: 'admin@atmoslifestyle.com',
    to,
    subject: 'Product Application Status Update',
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = router;
