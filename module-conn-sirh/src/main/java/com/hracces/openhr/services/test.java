package com.hracces.openhr.services;

import com.hraccess.openhr.*;
import com.hraccess.openhr.exception.HRException;
import com.hraccess.openhr.exception.UserConnectionException;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class test {

    private final String username = "TALAN2PR";
    private final String password = "HRA2023!";
    private IHRSession session;
    private IHRUser user;



    @PostConstruct
    public void init() throws HRException, ConfigurationException {
        HRApplication.configureLogs("C:\\Users\\user\\IdeaProjects\\OrgChart-siBackend\\src\\main\\java\\com\\hracces\\openhr\\conf\\log4j.properties");
        session = HRSessionFactory.getFactory().createSession(
                new PropertiesConfiguration("C:\\Users\\user\\IdeaProjects\\OrgChart-siBackend\\src\\main\\java\\com\\hracces\\openhr\\conf\\openhr.properties"));
        user = session.connectUser(username, password);

    }

    @PreDestroy
    public void cleanup() throws UserConnectionException {
        if (user != null && user.isConnected()) {
            user.disconnect();
        }
        if (session != null && session.isConnected()) {
            session.disconnect();
        }
    }

}




