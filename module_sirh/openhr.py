from jpype import JClass, shutdownJVM, startJVM
import os
from flask import Flask, jsonify

app = Flask(__name__)

# Chemin vers le répertoire contenant les JARs
jars_path = "/app/libs"

# Lister les fichiers dans le répertoire des JARs pour vérifier leur présence
print(f"Listing JAR files in {jars_path}:")
for file_name in os.listdir(jars_path):
    print(file_name)

# Démarrer la JVM avec les fichiers JAR
jar_files = [
    os.path.join(jars_path, jar)
    for jar in os.listdir(jars_path)
    if jar.endswith(".jar")
]
if jar_files:
    print(f"JAR files found: {jar_files}")
    startJVM(classpath=jar_files)
else:
    print(f"No JAR files found in {jars_path}")
    raise FileNotFoundError(f"No JAR files found in {jars_path}")

try:
    # Importer les classes Java nécessaires depuis les JARs
    Properties = JClass("java.util.Properties")
    PropertiesConfiguration = JClass(
        "org.apache.commons.configuration.PropertiesConfiguration"
    )
    HRApplication = JClass("com.hraccess.openhr.HRApplication")
    HRSessionFactory = JClass("com.hraccess.openhr.HRSessionFactory")
    IHRSession = JClass("com.hraccess.openhr.IHRSession")
    IHRUser = JClass("com.hraccess.openhr.IHRUser")
    HRDossierCollectionParameters = JClass(
        "com.hraccess.openhr.dossier.HRDossierCollectionParameters"
    )
    HRDataSourceParameters = JClass("com.hraccess.openhr.beans.HRDataSourceParameters")

    print("Java classes imported successfully.")
except ImportError as e:
    print(f"Failed to import classes from {jars_path}: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

try:
    # Configurer le système de journalisation à partir du fichier de configuration Log4J donné
    HRApplication.configureLogs("java/log4j.properties")

    # Création d'une session et connexion au serveur HR Access à partir du fichier de configuration OpenHR donné
    openhr_properties = Properties()
    openhr_properties.load(open("java/openhr.properties"))
    session = HRSessionFactory.getFactory().createSession(
        PropertiesConfiguration(openhr_properties)
    )

    user = None
    try:
        # Connexion de l'utilisateur avec l'identifiant de connexion et le mot de passe donnés
        user = session.connectUser("HRAUSER", "SECRET")

        # Création de la configuration pour gérer les dossiers d'employés HR Access
        parameters = HRDossierCollectionParameters()
        parameters.setType(HRDossierCollectionParameters.TYPE_NORMAL)
        parameters.setProcessName("FS001")
        parameters.setDataStructureName("ZY")
        parameters.addDataSection(HRDataSourceParameters.DataSection("00"))
        parameters.addDataSection(HRDataSourceParameters.DataSection("10"))

        # Instanciation d'une nouvelle collection de dossiers avec le rôle, la conversation et la configuration donnés
        dossierCollection = HRDossierCollection(
            parameters,
            user.getMainConversation(),
            user.getRole("EMPLOYEE(123456)"),
            HRDossierFactory(HRDossierFactory.TYPE_DOSSIER),
        )

        # Chargement d'un dossier employé à partir de la clé fonctionnelle donnée (groupe de politique, ID employé)
        employeeDossier = dossierCollection.loadDossier(HRKey("HRA", "123456"))

        # Récupération de l'occurrence unique de la section de données ZY10 (Birth)
        birthOccurrence = employeeDossier.getDataSectionByName("10").getOccur()

        # Mise à jour de la date de naissance de l'employé (Item ZY10 DATNAI)
        birthOccurrence.setDate("DATNAI", java.sql.Date.valueOf("1970-06-18"))

        # Validation des modifications sur le serveur HR Access
        employeeDossier.commit()

    finally:
        # Déconnexion de l'utilisateur si connecté
        if user and user.isConnected():
            user.disconnect()

        # Déconnexion de la session OpenHR si connectée
        if session and session.isConnected():
            session.disconnect()

except Exception as e:
    print(f"An unexpected error occurred: {e}")


@app.route("/")
def hello_world():
    # Créer une instance de la classe Java et appeler une méthode
    try:
        # HRApplication.configureLogs("/app/java/log4j.properties")
        result = "Java method executed successfully."
    except Exception as e:
        result = f"Error executing Java method: {e}"

    return jsonify({"message": result})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8002)

# Arrêter la JVM proprement
shutdownJVM()
