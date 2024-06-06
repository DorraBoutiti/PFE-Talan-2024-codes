package com.example.demo.email;

import com.example.demo.models.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Properties;
import java.util.Random;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender emailSender;

    public String alphaNumericString(int len) {
        String AB = "0123456789abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random rnd = new Random();

        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(AB.charAt(rnd.nextInt(AB.length())));
        }
        return sb.toString();
    }
    public void sendEmail(String to, String subject, String registrationNumber, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@transformation.rh.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText("Bonjour,\n" +
                "\n" +
                "Félicitations ! Votre accès à Smart Compensation Toolbox est maintenant activé. Voici vos informations de connexion :\n" +
                "\n" +
                "Plateforme : Smart Compensation Management\n" +
                "Identifiant : Votre matricule("+ registrationNumber + ")\n" +
                "Mot de passe : " + password + "\n" +
                "Connectez-vous dès maintenant en suivant ce lien : http://localhost:4200/.\n" +
                "\n" +
                "Excellente journée,");
        emailSender.send(message);

        System.out.println("Mail Sent Successfully");
    }

    public void sendAddUserEmail(String to, String subject, String registrationNumber, Role role, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@transformation.rh.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText("Bonjour,\n" +
                "\n" +
                "Nous sommes ravis de vous accueillir sur notre plateforme. Votre compte en tant que '" + role + "' a été créé avec succès et vous pouvez dès à présent accéder à nos services. ! Voici vos informations de connexion :\n" +
                "\n" +
                "Plateforme : Smart Compensation Management\n" +
                "Identifiant : Votre matricule("+ registrationNumber + ")\n" +
                "Mot de passe : " + password + "\n" +
                "Connectez-vous dès maintenant en suivant ce lien : http://localhost:4200/.\n" +
                "\n" +
                "Excellente journée,");
        emailSender.send(message);

        System.out.println("Mail Sent Successfully");
    }

    public void sendEmailReject(String to, String subject, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@transformation.rh.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText("Bonjour " + name + ", \n" +
                "\n" +
                "Nous vous remercions pour l'intérêt que vous avez manifesté envers Smart Compensation Toolbox.\n" +
                "\n" +
                "Cependant, après avoir examiné votre demande avec attention, nous regrettons de vous informer que nous ne pouvons pas activer votre accès à la plateforme pour le moment.\n" +
                "\n" +
                "Cordialement," + "\n" +
                "[L'équipe de Smart Compensation Toolbox]");
        emailSender.send(message);

        System.out.println("Mail Sent Successfully");
    }

    public void sendEmailDisabledAccount(String to, String subject, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@transformation.rh.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText("Bonjour, " + name + "\n" +
                "\n" +
                "Nous vous informons que votre accès à Smart Compensation Toolbox a été désactivé en raison du non-respect de nos conditions d'utilisation.\n" +
                "\n" +
                "Si vous avez des questions ou si vous souhaitez discuter de cette décision, n'hésitez pas à nous contacter à l'adresse noreply@transformation.rh.com \n" +
                "\n" +
                "Nous vous remercions pour votre compréhension.\n" +
                "\n" +
                "Cordialement," + "\n" + "[L'équipe de Smart Compensation Toolbox]");

        emailSender.send(message);

        System.out.println("Mail Sent Successfully");
    }
}
