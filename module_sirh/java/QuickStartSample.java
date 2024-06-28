package com.hraccess.openhr.samples;

import org.apache.commons.configuration.PropertiesConfiguration;
import com.hraccess.openhr.HRApplication;
import com.hraccess.openhr.HRSessionFactory;
import com.hraccess.openhr.IHRSession;
import com.hraccess.openhr.IHRUser;
import com.hraccess.openhr.beans.HRDataSourceParameters;
import com.hraccess.openhr.dossier.HRDossier;
import com.hraccess.openhr.dossier.HRDossierCollection;
import com.hraccess.openhr.dossier.HRDossierCollectionParameters;
import com.hraccess.openhr.dossier.HRDossierFactory;
import com.hraccess.openhr.dossier.HRKey;
import com.hraccess.openhr.dossier.HROccur;

public class QuickStartSample {
    public static void main(String[] args) throws Exception {
        // Configuring logging system from given Log4J property configuration file
        HRApplication.configureLogs("/app/java/log4j.properties");
        // Creating from given OpenHR configuration file and connecting session to HR Access server
        IHRSession session = HRSessionFactory.getFactory().createSession(
                new PropertiesConfiguration("/app/java/openhr.properties"));
        IHRUser user = null;
        try {
            // Connecting user with given login ID and password
            user = session.connectUser("HRAUSER", "SECRET");
            // Creating configuration to handle HR Access employee dossiers
            HRDossierCollectionParameters parameters = new HRDossierCollectionParameters();
            parameters.setType(HRDossierCollectionParameters.TYPE_NORMAL);
            parameters.setProcessName("FS001"); // Using process FS001 to read and update dossiers
            parameters.setDataStructureName("ZY"); // Dossiers are based on data structure ZY
            // Reading data sections ZY00 (ID) and ZY10 (Birth)
            parameters.addDataSection(new HRDataSourceParameters.DataSection("00"));
            parameters.addDataSection(new HRDataSourceParameters.DataSection("10"));
            // Instantiating a new dossier collection with given role, conversation and configuration
            HRDossierCollection dossierCollection = new HRDossierCollection(parameters,
                    user.getMainConversation(),
                    user.getRole("EMPLOYEE(123456)"),
                    new HRDossierFactory(HRDossierFactory.TYPE_DOSSIER));
            // Loading an employee dossier from given functional key (policy group, employee ID)
            HRDossier employeeDossier = dossierCollection.loadDossier(new HRKey("HRA", "123456"));
            // Retrieving the unique occurrence of data section ZY10 (Birth)
            HROccur birthOccurrence = employeeDossier.getDataSectionByName("10").getOccur();
            // Updating the employee's birth date (Item ZY10 DATNAI)
            birthOccurrence.setDate("DATNAI", java.sql.Date.valueOf("1970-06-18"));
            // Committing the changes to the HR Access server
            employeeDossier.commit();
        } finally {
            if ((user != null) && user.isConnected()) {
                // Disconnecting user
                user.disconnect();
            }
            if ((session != null) && session.isConnected()) {
                // Disconnecting OpenHR session
                session.disconnect();
            }
        }
    }
}
