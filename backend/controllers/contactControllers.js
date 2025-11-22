import Contact from '../models/Contact.js';
import { sendEmail } from '../utils/emailService.js';

// Submit contact inquiry
export const submitInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message',
      });
    }

    // Create inquiry
    const inquiry = await Contact.create({
      name,
      email,
      message,
    });

    // Send email notification to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@northwestmeats.com',
        subject: 'New Customer Inquiry - North West Meats',
        html: `
          <h2>New Customer Inquiry</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><em>Submitted on ${new Date().toLocaleString()}</em></p>
        `,
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. We will get back to you soon!',
      data: inquiry,
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting inquiry',
      error: error.message,
    });
  }
};

// Get all inquiries (Admin only)
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries',
      error: error.message,
    });
  }
};

// Update inquiry status (Admin only)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const inquiry = await Contact.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    if (status) {
      inquiry.status = status;
    }

    if (adminNotes !== undefined) {
      inquiry.adminNotes = adminNotes;
    }

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inquiry,
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inquiry',
      error: error.message,
    });
  }
};

// Delete inquiry (Admin only)
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Contact.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting inquiry',
      error: error.message,
    });
  }
};

