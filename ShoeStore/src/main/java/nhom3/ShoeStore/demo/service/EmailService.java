package nhom3.ShoeStore.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import nhom3.ShoeStore.demo.dto.OrderConfirmationRequest;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOrderConfirmationEmail(OrderConfirmationRequest request) {
        // Construct the email content
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("Gửi " + request.getFirstName() + request.getLastName() + ",\n\n");
        emailContent.append("Cảm ơn bạn đã đặt hàng! Đây là chi tiết đơn hàng của bạn:\n\n");
        
        for (OrderConfirmationRequest.Item item : request.getItems()) {
            emailContent.append("Product: " + item.getName() + "\n");
            emailContent.append("Size: " + item.getSize() + "\n");
            emailContent.append("Color: " + item.getColor() + "\n");
            emailContent.append("Price: $" + item.getPrice() + "\n");
            emailContent.append("Quantity: " + item.getQuantity() + "\n");
            emailContent.append("Image: " + item.getImage() + "\n\n");
        }
        
        emailContent.append("Total Price: $" + request.getTotalPrice() + "\n");
        emailContent.append("Payment Method: " + request.getPaymentMethod() + "\n\n");
        emailContent.append("We hope to serve you again soon!\n\nBest regards,\nYour Store");

        // Create email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getEmail());
        message.setSubject("Order Confirmation");
        message.setText(emailContent.toString());
        
        // Send the email
        javaMailSender.send(message);
    }
}
