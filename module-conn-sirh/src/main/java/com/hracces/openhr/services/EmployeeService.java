package com.hracces.openhr.services;

import com.hracces.openhr.repositories.EmployeeRepo;
import com.hraccess.openhr.*;
import com.hraccess.openhr.exception.AuthenticationException;
import com.hraccess.openhr.exception.SessionBuildException;
import com.hraccess.openhr.exception.SessionConnectionException;
import com.hraccess.openhr.exception.UserConnectionException;
import com.hraccess.openhr.msg.HRMsgExtractData;
import com.hraccess.openhr.msg.HRResultExtractData;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    private EmployeeRepo employeeRepo;
    @Autowired
    public EmployeeService(EmployeeRepo employeeRepo) {
        this.employeeRepo = employeeRepo;
    }


    private HRSessionFactory hrSessionFactory;
    IHRSession session;
    IHRUser user ;


    public HRResultExtractData executeQuery() throws ConfigurationException, SessionBuildException, SessionConnectionException, UserConnectionException, AuthenticationException {
        session = HRSessionFactory.getFactory().createSession(
                new PropertiesConfiguration("C:\\Users\\user\\IdeaProjects\\OrgChart-siBackend\\src\\main\\java\\com\\hracces\\openhr\\conf\\openhr.properties"));
        user = session.connectUser("TALAN2PR", "HRA2023!");

        IHRConversation conversation = user.getMainConversation();
// Retrieving one of the user's roles to send the message
        IHRRole role = user.getRole("ALLHRLO(MA)");
        HRMsgExtractData request = new HRMsgExtractData();
        request.setFirstRow(0);
        request.setMaxRows(20);
    request.setSqlStatement("SELECT * FROM ZE2A");
      // request.setSqlStatement("SELECT DISTINCT NUDOSS, IDOU00, IDOU01 FROM ZE2A" +"");
//DTEF00, LBOUSH, MANNAM
        //request.setSqlStatement("SELECT DISTINCT ZY.NUDOSS, ZY.NOMUSE, ZY.PRENOM, ZR.IDOU00, ZR.LBOUSH, ZR.MANNAM FROM ZY00 AS ZY JOIN ZEOR AS ZR ON ZY.NUDOSS = ZR.NUDOSS JOIN ZY1S AS Y1 ON ZY.NUDOSS = Y1.NUDOSS JOIN ZYAU AS A ON ZY.NUDOSS = A.NUDOSS JOIN ZY3B AS B ON ZY.NUDOSS = B.NUDOSS WHERE Y1.SOCDOS = 'MIT' AND Y1.STEMPL = 'A' AND ZR.DTEF00 >= GETDATE()");

//request.setSqlStatement("SELECT DISTINCT zy.NOMUSE, zy.PRENOM, ze.IDOU00, ze.IDOU01 FROM ZY00 zy, ZE2A ze WHERE zy.NUDOSS = ze.NUDOSS AND zy.SOCDOS='MIT' ");


      request.setSqlStatement("SELECT DISTINCT zy.NUDOSS, zy.NOMUSE, zy.PRENOM, zr.DTEF00, zr.IDOU00, ze.IDOU00, ze.IDOU01, zr.MANNAM  FROM ZY00 zy, ZEOR zr, ZE2A ze WHERE zy.NUDOSS = zr.NUDOSS AND zy.NUDOSS = ze.NUDOSS AND zy.SOCDOS='MIT' AND zr.DTEN00 >= GETDATE() ");
        //request.setSqlStatement("SELECT zr.MANNAM FROM ZEOR zr WHERE zr.DTEN00 >= GETDATE()");


        HRResultExtractData result = (HRResultExtractData)
                conversation.send(request, role);
        return result;



        // Assuming you have some method to execute this request in your repository or some utility class
        // employeeRepo.executeQuery(request);

    }

}
